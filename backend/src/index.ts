import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import userRouter from "./routes/users";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));


app.use('/user', userRouter);

const run = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port:  3307,
            user: 'root',
            password:  'root_password',
            database: 'shop_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        app.locals.db = connection;

        app.listen(port, () => {
            console.log(`Server started on port ${port}!`);
        });

        const cleanUp = async () => {
            await connection.end();
            console.log('MySQL connection closed.');
            process.exit(0);
        };

        process.on('exit', cleanUp);
        process.on('SIGINT', cleanUp);
        process.on('SIGTERM', cleanUp);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

run();