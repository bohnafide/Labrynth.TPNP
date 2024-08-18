const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const accountsFilePath = 'accounts.json';
const logFilePath = 'log.json';
const failedLoginsPath = 'failed-logins.txt';

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

    // Load accounts from the JSON file
    const accounts = JSON.parse(fs.readFileSync(accountsFilePath, 'utf8'));

    // Find the account with the matching username and password
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        const logEntry = {
            timestamp: new Date(),
            username: username,
            action: 'login-success',
        };
        fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');

        // Redirect to YouTube upon successful login
        res.redirect('https://www.youtube.com');
    } else {
        const logEntry = `Failed login attempt for username: ${username} at ${new Date()}\n`;
        fs.appendFileSync(failedLoginsPath, logEntry);

        res.json({ message: 'Login failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
