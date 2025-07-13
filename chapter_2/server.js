//The address of this server connected to the network is: http://localhost:8008
const express = require(`express`);
const app = express();
const PORT = 8008;

let data = ["Matthew"]

//Middleware
app.use(express.json());

// ENDPOINT - HTTP VERBS (method) && ROUTES (or paths)

// Type 1 - Website endpoints (sending back html)
app.get('/', (req, res) => {
    res.send(`
        <body>
        <h1>DATA:</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
        `)
});

app.get('/dashboard', (req, res) => {
    res.send(`
        <body>
        <h1>Dashboard</h1>
        <a href="/">Home</a>
        </body>
        `);
});

// Type 2 - API endpoints

app.get('/api/data', (req, res) => {
    console.log("This is for data");
    res.send(data);
});

app.post(`/api/data`, (req, res) => {
    //Someone wants to create a user (sign-up)
    //user clicks sing up button after inputing credentials
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);
});

app.delete('/api/data', (req, res) => {
    data.pop();
    console.log("We deleted last data entree");
    res.sendStatus(203);
});

app.listen(PORT, () => {console.log(`Server has started on: ${PORT}`)});