import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const PORT = process.env.PORT || 8008;

//  Get file path from URL of current module
const __filename = fileURLToPath(import.meta.url);

//  Get directory name from file path
const __dirname = dirname(__filename);

//  Middleware
app.use(express.json());
//  Serves HTML file from /public directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//  Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server has started at: ${PORT}`);
})