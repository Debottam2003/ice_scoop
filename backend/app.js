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
app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serving Static files 

app.get("/icescoop", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.get("/icescoop/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/icescoop/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Register.html"));
});

// Login POST route
app.post("/icescoop/login", express.json(), async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Provide all credentials" });
    }
    try {
        let data = await pool.query("select email, password from users where email = $1", [email]);
        if (data.rows.length === 0) {
            res.send(400).json({ message: "Wrong credentails." });
            return;
        }
        else {
            if (password === data.rows[0].password) {
                res.send(200).json({ message: "Welcome to IceScoop" });
                return;
            }
            else {
                res.send(400).json({ message: "Wrong credentails." });
                return;
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server error." });
    }
});

// Register POST route
app.post("/icescoop/register", express.json(), async (req, res) => {
    console.log(req.body);
    let { email, password, pin_code, address } = req.body();
    if (!email || !password || !pin_code || !address) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }
    try {
        let data = await pool.query("select id from users where email = $1", [email]);
        if (data.rows.length > 0) {
            res.status(400).json({ message: "This email/phone_no already exists" });
            return;
        } else {
            await pool.query("insert into users(email, password, pin_code, address)");
            res.status(200).json({ message: "Welcome to Ice Scoop." });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
})

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