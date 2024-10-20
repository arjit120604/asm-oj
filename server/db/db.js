const { Client } = require('pg');
const {hashPassword} = require('../hash.js')
const client = new Client({
    user: 'arjit',
    host: 'localhost',
    database: 'asm-oj',
    password: 'pass123',
    port: 5432,
});

async function connectAndCreateTable() {
    try {
        await client.connect();
        console.log('Connected to the database');
        
        // await client.query('DROP TABLE IF EXISTS users;')
        // console.log('Table dropped if it existed');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
            username text PRIMARY KEY,
            password text NOT NULL
            );
        `);
        console.log('Table created');

        let hash = await hashPassword('pass123');
        await client.query(`
            INSERT INTO users (username, password) VALUES ('a', '${hash}')
            ON CONFLICT (username) DO NOTHING;
        `);
        console.log('User a added or already exists');
    } catch (err) {
        console.error('Error connecting to the database or creating table', err);
    }
}

async function getHashedPassword(username) {
    try {
        const res = await client.query('SELECT password FROM users WHERE username = $1', [username]);
        if (res?.rows?.length > 0) {
            return res.rows[0].password;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        console.error('Error fetching password from the database', err);
        throw err;
    }
}
async function insertUsernamePassword(username, password) {
    try {
        await client.query(`
            INSERT INTO users (username, password) VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING;
        `, [username, password]);
        console.log('User added or already exists');
    } catch (err) {
        console.error('Error inserting username and password into the database', err);
    }
}

module.exports = {connectAndCreateTable, getHashedPassword, insertUsernamePassword};