const { Client } = require('pg');
const {hashPassword} = require('../hash.js');
require('dotenv').config();
const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
});

async function connectAndCreateTable() {
    try {
        await client.connect();
        console.log('Connected to the database');
        
        // await client.query('DROP TABLE IF EXISTS users;')
        // console.log('Table dropped if it existed');
        

        //uncomment this to add user with usename 'a' and password 'pass123'
        // await client.query(`
        //     CREATE TABLE IF NOT EXISTS users (
        //     username text PRIMARY KEY,
        //     password text NOT NULL
        //     );
        // `);
        // console.log('Table created');

        // let hash = await hashPassword('pass123');
        // await client.query(`
        //     INSERT INTO users (username, password) VALUES ('a', '${hash}')
        //     ON CONFLICT (username) DO NOTHING;
        // `);
        // console.log('User a added or already exists');
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