import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

//  Resgister new user endpoint /auth/register
router.post('/register', (req, res) => { 
    const {username, password} = req.body;

    //  encrypt password
    const hashedPassword = bcrypt.hashSync(password, 8)

    //  Save new user and hashed password
    try{
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUEs (?, ?)`);
        const result = insertUser.run(username, hashedPassword);

        //  Let's add their first todo for them as an example
        const defaultTodo = `Hey there :D Try adding your first todo!`;
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // Create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24'});
        res.json({ token });
    } catch (err){
        console.log(err.message);
        res.sendStatus(503);
    }
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    try{
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = getUser.get(username);

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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24hr'});
        res.json({ token });
    } catch (err){
        console.log(err.message);
        res.sendStatus(503);
    }
});


export default router;