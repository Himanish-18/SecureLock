const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let lastSignedInUser = null;

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: '0909',  
    database: 'securelock'  
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            return res.status(400).json({ message: 'Email already exists. Please use another email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) throw err;
            
            console.log(`User ${username} registered successfully!`);

            const createUserTableQuery = `
                CREATE TABLE IF NOT EXISTS \`${username}\` (
                    site VARCHAR(255),
                    password VARCHAR(255)
                )
            `;
            db.query(createUserTableQuery, (err) => {
                if (err) {
                    console.error(`Error creating table for user ${username}:`, err);
                    return res.status(500).json({ message: 'User registered, but error creating user-specific table.' });
                }

                console.log(`Table for user '${username}' created successfully.`);
                lastSignedInUser = username;
                res.status(200).json({ message: 'User registered and table created successfully!' });
            });
        });
    });
});

// Sign-in endpoint
app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(400).json({ message: 'Username not found.' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        lastSignedInUser = username;
        res.status(200).json({ message: `Welcome, ${user.username}!` });
    });
});

// Add password endpoint
app.post('/addPassword', (req, res) => {
    const { site, password } = req.body;

    if (!lastSignedInUser) {
        return res.status(401).json({ message: 'User not signed in.' });
    }

    const insertPasswordQuery = `INSERT INTO \`${lastSignedInUser}\` (site, password) VALUES (?, ?)`;
    db.query(insertPasswordQuery, [site, password], (err) => {
        if (err) {
            console.error('Error saving password:', err);
            return res.status(500).json({ message: 'Error saving password.' });
        }

        res.status(200).json({ message: 'Password saved successfully!' });
    });
});
// Password history endpoint
app.get("/password-history", (req, res) => {
    const query = `SELECT site, password FROM \`${lastSignedInUser}\``;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Failed to retrieve password history" });
        }
        res.status(200).json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
