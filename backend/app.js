import express from "express"
import pool from './db.js'
import cors from "cors"
import { fileURLToPath } from "url"
import path from "path"

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

// console.log(__filename);
// console.log(__dirname);

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/icescoop", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landing.html"));
});

try {
    await pool.connect()
    console.log("DataBase connected successfully...");
    app.listen(3333, () => {
        console.log("Server is listening and serving on port:", 3333, "...");
    });
}
catch (err) {
    console.log(err.message)
}