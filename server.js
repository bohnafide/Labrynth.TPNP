const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const logFilePath = 'log.json';

// Middleware to log every visit to the website
app.use((req, res, next) => {
    const logEntry = {
        timestamp: new Date(),
        ip: req.ip,
        url: req.originalUrl,
    };
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
    next();
});

// Route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple validation (in a real application, you'd check against a database)
    if (username === 'admin' && password === 'password') {
        const logEntry = {
            timestamp: new Date(),
            username: username,
            action: 'login-success',
        };
        fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
        res.json({ message: 'Login successful' });
    } else {
        const logEntry = {
            timestamp: new Date(),
            username: username,
            action: 'login-failed',
        };
        fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
        res.json({ message: 'Login failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
