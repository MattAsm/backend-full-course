import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

//  Resgister new user endpoint /auth/register
router.post('/register', async (req, res) => { 
    const {username, password} = req.body;

    //  encrypt password
    const hashedPassword = bcrypt.hashSync(password, 8)

    //  Save new user and hashed password
    try{
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        //  Let's add their first todo for them as an example
        const defaultTodo = `Hey there :D Try adding your first todo!`;

        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        });

        // Create a token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({ token });
    } catch (err){
        console.log(err.message);
        res.sendStatus(503);
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        //  Checks if username exists
        if(!user){
            return res.status(404).send({ message : "User not found"});
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        //  Checks if password matches
        if(!passwordIsValid){
            return res.status(401).send({ message: "Invalid password" });
        }
        //  Successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h'});
        res.json({ token });
    } catch (err){
        console.log(err.message);
        res.sendStatus(503);
    }
});


export default router;