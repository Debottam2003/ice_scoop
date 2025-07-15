import express from "express";
import pool from "./db.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import transporter from "./mail.js";
import internalError from "./internalError.js";
import dotenv from 'dotenv';

dotenv.config();

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

//Admin Page
app.get("/icescoop/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "admin.html"))
});

//Manage User Page ( Admin )
app.get("/icescoop/admin/manageusers", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "manageUsers.html"))
});

//Manage Product Page ( Admin )
app.get("/icescoop/admin/manageproducts", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "manageProducts.html"))
});

//View Order Page ( Admin )
app.get("/icescoop/admin/manageorders", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "manageOrders.html"))
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
    let { rows } = await pool.query(
      "select id, email, address, pin_code from users where email = $1",
      [user_email]
    );
    if (rows.length == 0) {
      res.status(400).json({ message: "User not found" });
      return;
    } else {
      // console.log(rows);
      res.status(200).json({ message: rows });
    }
  } catch (err) {
    // res.status(500).json({ message: "Internal Server error" });
    internalError(req, res);
  }
});

// Login POST route
app.post("/icescoop/userLogin", express.json(), async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Provide all credentials" });
  }
  try {
    // console.log(email, password);
    let adminData = await pool.query("select email, password from admin where email = $1", [email]);
    if (adminData.rows.length > 0) {
      // console.log(adminData.rows);
      if (password === adminData.rows[0].password) {
        return res.status(201).json({ message: "Welcome admin" });
      }
    }
    let data = await pool.query(
      "select email, password from users where email = $1",
      [email]
    );
    if (data.rows.length === 0) {
      res.status(400).json({ message: "Wrong credentails." });
      return;
    } else {
      if (password === data.rows[0].password) {
        res.status(200).json({ message: "Welcome Back to IceScoop again" });
        return;
      } else {
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
  let { email, password, pin_code, address, phone } = req.body;
  if (!email || !password || !pin_code || !address || !phone) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }
  try {
    let data = await pool.query("select id from users where email = $1", [
      email,
    ]);
    if (data.rows.length > 0) {
      res.status(400).json({ message: "This email/phone_no already exists" });
      return;
    } else {
      await pool.query(
        "insert into users(email, password, pin_code, address, phone) values($1, $2, $3, $4, $5)",
        [email, password, pin_code, address, phone]
      );
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
    return res.status(400).send("Error Sending OTP");
  }
  // send OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random OTP
  usersOTP[email] = otp;
  // console.log(usersOTP);
  // console.log(otp);
  // Send the email
  const mailOptions = {
    from: "debsoumya60812@gmail.com",
    to: email,
    replyTo: "debsoumya60812@gmail.com",
    subject: "Your OTP for Password Reset",
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
        `,
  };

  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Transporter Configuration Error:", error.message);
    } else {
      console.log("✅ Email server is ready to send messages.");
    }
  });
  // console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.error("Error sending email:", error.message);
      return res.status(500).json({ message: "Error sending OTP" });
    }
    res.status(200).json({ message: "OTP sent to Your Email id" });
  });
});

// OTP verifier patch route and update password
app.patch("/icescoop/resetpassword", express.json(), async (req, res) => {
  let { email, newPassword, otp } = req.body;
  if (!email || !newPassword || !otp) {
    res.status(400).json({ message: "Invalid Credentials Use Resend OTP" });
  }
  try {
    let { rows } = await pool.query(
      "select id, email from users where email = $1",
      [email]
    );
    if (rows.length === 0) {
      res.status(400).json({ message: "This is not a Registered email" });
      return;
    }
    if (Number(otp) === usersOTP[email]) {
      await pool.query("update users set password = $1 where email = $2", [
        newPassword,
        email,
      ]);
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
    let { rows } = await pool.query(
      "select id, email from users where email = $1",
      [user_email]
    );
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
    let { rows } = await pool.query("select * from icecreams where in_stock = TRUE order by icecream_id");
    res.status(200).json({
      message: rows, // array of objects
    });
  } catch (err) {
    // res.status(500).json({ message: "Internal Server error" });
    internalError(req, res);
  }
});

//fetch all iecescreams for (admin)
app.get("/icescoop/admin/icecreams", async (req, res) => {
  try {
    let { rows } = await pool.query("select * from icecreams order by icecream_id;");
    // if(rows.length>0) console.log('data is here');
    res.status(200).json({
      message: rows, // array of objects
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
    internalError(req, res);
  }
});
// fetch all order table data
app.get("/icescoop/orderData/:user_email", async (req, res) => {
  let user_email = req.params.user_email;
  // console.log(user_email);
  try {
    // to fetch user email
    let data = await pool.query("select id from users where email = $1", [
      user_email,
    ]);
    // console.log(data.rows)
    // to fetch user orders
    let { rows } = await pool.query(
      "select orders.orders_id as orderID , icecreams.icecream_id as icecream_id , icecreams.name as name , icecreams.image  as image , items.price as price , items.quantity as quantity , items.type as type , orders.date as date from orders,icecreams,items where orders.orders_id = items.orders_id AND items.icecream_id = icecreams.icecream_id AND orders.user_id = $1 order by orders.orders_id desc;",
      [data.rows[0].id]
    );
    if (rows.length > 0) {
      // console.log(rows[0]);
      res.status(200).json({ message: rows });
    } else {
      res.status(400).json({ message: "No data Found" });
    }
  } catch (err) {
    // res.status(500).json({ message: "Internal Server error" });
    internalError(req, res);
  }
});

app.post("/icescoop/placeorder", express.json(), async (req, res) => {
  const { email, cartData } = req.body;

  if (!email || !cartData || !Array.isArray(cartData)) {
    return res.status(400).json({ message: "Provide all fields" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1;",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, paymentstatus, date, time)
                     VALUES ($1, $2, $3, $4)
                     RETURNING orders_id;`,
        [
          userId,
          "pending",
          new Date().toLocaleDateString(),
          new Date().toLocaleTimeString(),
        ]
      );

      const orderId = orderResult.rows[0].orders_id;
      for (const item of cartData) {
        await client.query(
          `INSERT INTO items (orders_id, icecream_id, quantity, type, price)
                     VALUES ($1, $2, $3, $4, $5);`,
          [orderId, item.icecream_id, item.total, item.type, item.price]
        );
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Order placed successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", error);
      internalError();
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database error:", err);
    internalError();
  }
});

// Fetch one icecream data
app.get("/icescoop/foundicecream/:icecream_id", async (req, res) => {
  let icecream_id = req.params.icecream_id;
  // console.log(icecream_id);
  try {
    let { rows } = await pool.query(
      "select * from icecreams where icecream_id = $1",
      [icecream_id]
    );
    res.status(200).json({
      message: rows,
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
    // console.log(icecreamName);
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

// all users
app.get("/icescoop/admin/allusers/:admin_email", async (req, res) => {
  try {
    // console.log(req.params.admin_email);
    let { rows } = await pool.query("select id from admin where email = $1", [req.params.admin_email]);
    if (rows.length > 0) {
      let data = await pool.query("select id, email, phone, address, pin_code from users order by id");
      // console.log(data.rows[0]);
      res.status(200).json({ message: data.rows });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    console.log(err.message);
    internalError(req, res);
  }
});

// stock update
app.post("/icescoop/admin/stock/:icecream_id", express.json(), async (req, res) => {
  let icecream_id = req.params.icecream_id;
  let { in_stock } = req.body;
  // console.log(in_stock, icecream_id);

  if (!icecream_id) {
    res.status(400).json({ message: 'provide icecream id & instock status' });
    return;
  }
  try {
    // console.log(icecream_id, in_stock);
    let dbRes = await pool.query("update icecreams set in_stock = $1 where icecream_id = $2 returning in_stock", [in_stock, icecream_id]);
    if (dbRes.rows.length > 0) {
      res.status(200).json({ message: "Done" });
    } else {
      res.status(400).json({ message: "Couldn't upadate DB" });
    }
  } catch (err) {
    console.log(err)
    internalError()
    // res.status (500).json({message : "Bad Request"});
  }
});

// update icecream data

// add new ice cream data

// Detailed orders data
app.get("/icescoop/admin/detailedorder/:admin_email/:order_id", async (req, res) => {
  try {
    // console.log(req.params.admin_email);
    let { rows } = await pool.query("select id from admin where email = $1", [req.params.admin_email]);
    if (rows.length > 0) {
      let data = await pool.query("select orders.orders_id as orderID, orders.paymentstatus as paymentstatus, icecreams.name as name, items.price as price , items.quantity as quantity , items.type as type , orders.date as date from orders, icecreams, items where orders.orders_id = items.orders_id AND items.icecream_id = icecreams.icecream_id and orders.orders_id = $1;", [req.params.order_id]);
      // console.log(data.rows[0]);
      let total = await pool.query("select sum(items.price) as total_price from orders, items where orders.orders_id = items.orders_id and orders.orders_id = $1 and orders.paymentstatus = 'pending';", [req.params.order_id]);
      res.status(200).json({ message: data.rows, total_price: total.rows[0].total_price || 'Already Paid' });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    console.log(err.message);
    internalError(req, res);
  }
});

// All Orders Data
app.get("/icescoop/admin/allorders/:admin_email", async (req, res) => {
  try {
    // console.log(req.params.admin_email);
    let { rows } = await pool.query("select id from admin where email = $1", [req.params.admin_email]);
    if (rows.length > 0) {
      let data = await pool.query("select * from orders order by orders_id desc");
      // console.log(data.rows[0]);
      res.status(200).json({ message: data.rows });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    console.log(err.message);
    internalError(req, res);
  }
});

// Update orders data
app.get("/icescoop/admin/markpaid/:admin_email/:orders_id", async (req, res) => {
  try {
    console.log(req.params.admin_email, req.params.orders_id);
    let { rows } = await pool.query("select id from admin where email = $1", [req.params.admin_email]);
    if (rows.length > 0) {
      let data = await pool.query("update orders set paymentstatus = 'paid' where orders_id = $1 returning orders_id, paymentstatus", [req.params.orders_id]);
      // console.log(data.rows[0]);
      res.status(200).json({ message: "Data updated successfully" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    // console.log(err.message);
    internalError(req, res);
  }
});

// Database connection then listen and serve
let PORT = process.env.PORT || 4444;

try {
  await pool.connect();
  console.log("DataBase connected successfully...");
  app.listen(PORT, () => {
    console.log("Server is listening and serving on port:", PORT, "...");
  });
} catch (err) {
  console.log(err.message);
}
