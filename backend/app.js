import express, { response } from "express"
import pool from './db.js'
import cors from "cors"
import { fileURLToPath } from "url"
import path from "path"
import transporter from "./mail.js"
import internalError from "./internalError.js"

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

// console.log(__filename);
// console.log(__dirname);

let usersOTP = {};

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

// User Account page
app.get("/icescoop/account", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "profile.html"));
});

// Orders Page
app.get("/icescoop/orders", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "orders.html"));
});

// Cart Page
app.get("/icescoop/cart", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cart.html"));
});

// Forgot Password Page
app.get("/icescoop/forgotpassword", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "forgotpassword.html"));
});

// Error page
app.get("/icescoop/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "error.html"));
});

// User account details
app.get("/icescoop/account/:user_email", async (req, res) => {
    let user_email = req.params.user_email;
    try {
        let { rows } = await pool.query("select id, email, address, pin_code from users where email = $1", [user_email]);
        if (rows.length == 0) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        else {
            // console.log(rows);
            res.status(200).json({ message: rows });
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
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
                res.status(200).json({ message: "Welcome Back to IceScoop again" });
                return;
            }
            else {
                res.status(400).json({ message: "Wrong credentails." });
                return;
            }
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    }
});

// Register POST route
app.post("/icescoop/userRegister", express.json(), async (req, res) => {
    // console.log(req.body);
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
        // console.log(err.message);
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    }
});

// Send OTP
app.post("/icescoop/otp", express.json(), (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.status(400).send('Error Sending OTP');
    }
    // send OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random OTP
    usersOTP[email] = otp;
    console.log(usersOTP);
    console.log(otp);
    // Send the email
    const mailOptions = {
        from: 'debsoumya60812@gmail.com',
        to: email,
        replyTo: 'debsoumya60812@gmail.com',
        subject: 'Your OTP for Password Reset',
        text: `Your OTP code is: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
                <div style="max-width: 400px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 24px;">
                    <h2 style="color:rgb(7, 143, 39); text-align: center; margin-bottom: 16px;">Your OTP Code</h2>
                    <p style="font-size: 16px; color: #333; text-align: center;">Use the following OTP to proceed:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #2d8cf0; background: #f0f7ff; border-radius: 6px; padding: 16px; text-align: center; letter-spacing: 6px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #888; text-align: center;">This OTP is valid for a single use only.</p>
                </div>
            </div>
        `
    };

    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Transporter Configuration Error:', error.message);
        } else {
            console.log('✅ Email server is ready to send messages.');
        }
    });
    // console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({ message: 'Error sending OTP' });
        }
        res.status(200).json({ message: 'OTP sent to Your Email id' });
    });
});

// OTP verifier patch route and update password
app.patch("/icescoop/resetpassword", express.json(), async (req, res) => {
    let { email, newPassword, otp } = req.body;
    if (!email || !newPassword || !otp) {
        res.status(400).json({ message: "Invalid Credentials Use Resend OTP" });
    }
    try {
        let { rows } = await pool.query("select id, email from users where email = $1", [email]);
        if (rows.length === 0) {
            res.status(400).json({ message: "This is not a Registered email" });
            return;
        }
        if (Number(otp) === usersOTP[email]) {
            await pool.query("update users set password = $1 where email = $2", [newPassword, email]);
            res.status(200).json({ message: "Password reset Successful" });
        } else {
            res.status(400).json({ message: "Wrong OTP try Resend OTP" });
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    } finally {
        delete usersOTP.email;
        // delete usersOTP[email];
    }
});

// Logout get route
app.get("/icescoop/logout/:user_email", async (req, res) => {
    let user_email = req.params.user_email;
    try {
        let { rows } = await pool.query("select id, email from users where email = $1", [user_email]);
        if (rows.length > 0) {
            res.status(200).json({ message: "You are Successfully logged out" });
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
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
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    }
});

// fetch all order table data
app.get("/icescoop/orderData/:user_email", async (req, res) => {

    let user_email = req.params.user_email;
    // console.log(user_email);
    try {
        // to fetch user email
        let data = await pool.query("select id from users where email = $1", [user_email]);
        // console.log(data.rows)
        // to fetch user orders 
        let { rows } = await pool.query("select orders.orders_id as orderID , icecreams.icecream_id as icecreamID , icecreams.name as name , icecreams.image  as image , items.price as price , items.quantity as quantity , items.type as type , orders.date as date from orders,icecreams,items where orders.orders_id = items.orders_id AND items.icecream_id = icecreams.icecream_id AND orders.user_id = $1 order by orders.orders_id desc;",
            [data.rows[0].id]);
        if (rows.length > 0) {
            // console.log(rows);
            res.status(200).json({ message: rows });
        } else {
            res.status(400).json({ message: "No data Found" });
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    }
});

//place order
app.post("/icescoop/placeorder", express.json(), async (req, res) => {
    // console.log(req.body);

    let { email, cartData } = req.body;

    if (!email && !cartData) {
        res.status(400).json({ message: "Provide all fields" });
        return;
    }

    try {
        let uid = await pool.query("select id from users where email = $1;", [email]);
        if (uid.rows.length === 0) {
            res.status(404).json({ message: "Bad Request" });
        }
        // console.log(uid);
        cartData.forEach(async (e) => {
            let order_id = await pool.query("insert into orders(user_id,paymentstatus,date,time)values($1,$2,$3,$4)returning orders_id;",
                [uid.rows[0].id, "pending", new Date().toLocaleDateString(), new Date().toLocaleTimeString()]);

            await pool.query("insert into items (orders_id, icecream_id, quantity, type, price) values($1, $2, $3, $4,$5);",
                [order_id.rows[0].orders_id, e.icecream_id, e.total, e.type, e.price]);

        });
        res.status(200);
        res.send('hello');
    } catch (err) {
        internalError(req, res);
    }
});

// Fetch one icecream data
app.get("/icescoop/foundicecream/:icecream_id", async (req, res) => {
    let icecream_id = req.params.icecream_id;
    // console.log(icecream_id);
    try {
        let { rows } = await pool.query("select * from icecreams where icecream_id = $1", [icecream_id]);
        res.status(200).json({
            message: rows
        });
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
    }
});

// Search Icecream by name 
app.get("/icescoop/foundicecream/name/:icecreamName", async (req, res) => {
    try {
        let icecreamName = req.params.icecreamName;
        console.log(icecreamName);
        let { rows } = await pool.query(
            `SELECT * FROM icecreams WHERE name ILIKE $1 LIMIT 1`,
            [`%${icecreamName}%`]
        );
        if (rows.length === 0) {
            res.status(400).json({ message: "Nothing Found" });
        } else {
            res.status(200).json({ message: rows });
        }
    } catch (err) {
        // res.status(500).json({ message: "Internal Server error" });
        internalError(req, res);
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