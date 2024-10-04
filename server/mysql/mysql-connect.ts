import mysql, { Connection } from "mysql2";


const connection: Connection = mysql.createConnection({
    host: "localhost",
    user: "foo",
    password: "bar",
    database: "foobar"
});

connection.connect();

export default connection;