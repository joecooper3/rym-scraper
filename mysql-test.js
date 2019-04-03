import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const { SQL_HOST, SQL_USER, SQL_PASS, SQL_DB, SQL_PORT } = process.env;

const con = mysql.createConnection({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASS,
    database: SQL_DB,
    port: SQL_PORT
})

const query = 'SELECT post_title FROM mw_posts WHERE post_type = "team_member"';

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected~");
});

con.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(fields);
});

con.end();
 
console.log('yeah it\'s goof');