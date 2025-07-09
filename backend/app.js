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
app.set("strict routing", true);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Serving the html pages
app.use(express.static(path.join(__dirname, "public")));

// Landing page
app.get("/icescoop", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "landing.html"));
});

// Login page
app.get("/icescoop/login", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "Login.html"));
});

// Register page
app.get("/icescoop/register", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "Register.html"));
});

// Flavours/Items Page
app.get("/icescoop/flavours", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "Items.html"));
});

// User account details
app.get("/icescoop/acount/:user_email", async (req, res) => {
    let user_email = req.params.user_email;
    try {
        let { rows } = await pool.query("select id, email, address, pin_code from users where email = $1", [user_email]);
        if (rows.length == 0) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        else {
            res.status(200).json({ message: rows });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
})

// Login POST route
app.post("/icescoop/userLogin", express.json(), async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Provide all credentials" });
    }
    try {
        console.log(email, password);
        let data = await pool.query("select email, password from users where email = $1", [email]);
        if (data.rows.length === 0) {
            res.status(400).json({ message: "Wrong credentails." });
            return;
        }
        else {
            if (password === data.rows[0].password) {
                res.status(200).json({ message: "Welcome to IceScoop again" });
                return;
            }
            else {
                res.status(400).json({ message: "Wrong credentails." });
                return;
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server error." });
    }
});

// Register POST route
app.post("/icescoop/userRegister", express.json(), async (req, res) => {
    console.log(req.body);
    let { email, password, pin_code, address } = req.body;
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
            await pool.query("insert into users(email, password, pin_code, address) values($1, $2, $3, $4)", [email, password, pin_code, address]);
            res.status(200).json({ message: "Welcome to Ice Scoop." });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Logout get route
app.get("/icescoop/logout/:user_email", async (req, res) => {
    let user_email = req.params.user_email;
    try {
        let { rows } = await pool.query("select id, email from users where email = $1", [user_email]);
        if (rows.length > 0) {
            res.status(200).json({ message: "success" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server error" });
    }
});

// Fetch all of the icecream data
app.get("/icescoop/icecreams", async (req, res) => {
    try {
        let { rows } = await pool.query("select * from icecreams");
        res.status(200).json({
            message: rows // array of objects
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Fetch one icecream data
app.get("/icescoop/foundicecream/:icecream_id", async (req, res) => {
    let icecream_id = req.params.icecream_id;
    console.log(icecream_id);
    try {
        let { rows } = await pool.query("select * from icecreams where icecream_id = $1", [icecream_id]);
        res.status(200).json({
            message: rows
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Database connection then listen and serve
try {
    await pool.connect()
    console.log("DataBase connected successfully...");
    app.listen(3333, () => {
        console.log("Server is listening and serving on port:", 3333, "...");
    });
}
catch (err) {
    console.log(err.message);
}