const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "sole-ctf-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));

// ================================
// DATABASE
// ================================

const db = new Database("shop.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        secret INTEGER DEFAULT 0
    );
`);

// Reset demo data when database is first created
const userCount = db
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get().count;

if (userCount === 0) {
    db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `).run("achraf", "supersecret123");

    db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `).run("admin", "admin123");
}

const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get().count;

if (productCount === 0) {
    const insert = db.prepare(`
        INSERT INTO products
        (name, category, price, secret)
        VALUES (?, ?, ?, ?)
    `);

    insert.run("Air Runner X", "Running", 129, 0);
    insert.run("Street Classic", "Casual", 99, 0);
    insert.run("Court Pro", "Basketball", 149, 0);
    insert.run("Velocity Max", "Running", 179, 0);

    // CTF ARTICLE
    insert.run("CTF VIP Article", "Exclusive", 9999, 1);
}

// ================================
// LOGIN
// ================================

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }
    // else {
    //     return res.status(200).json({
    //         success : true,
    //         message : "Welcome a W9"
    //     })
    // }

    /*
     * ============================================================
     * INTENTIONALLY VULNERABLE SQL QUERY
     * ============================================================
     *
     * DO NOT use this pattern in a real application.
     *
     * The CTF payload is:
     *
     * Username: achraf
     * Password: ' OR 1=1 --
     *
     * ============================================================
     */

    const query = `
        SELECT id, username
        FROM users
        WHERE username = '${username}'
        AND password = '${password}' 
        LIMIT 1
    `;

    console.log("[CTF] Login query:");
    console.log(query);

   try {
    const user = db.prepare(query).get();

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });
    }

    req.session.user = {
        id: user.id,
        username: user.username
    };

    req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to save session"
            });
        }

        console.log("Session saved:", req.session);

        return res.json({
            success: true,
            message: `Welcome ${user.username}!`,
            user: user.username
        });
    });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Database error."
        });
    }
});

// ================================
// CURRENT USER
// ================================

app.get("/api/me", (req, res) => {
    if (!req.session.user) {
        return res.json({
            loggedIn: false
        });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });
});

// ================================
// LOGOUT
// ================================

app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({
            success: true
        });
    });
});

// ================================
// PRODUCTS
// ================================

app.get("/api/products", (req, res) => {
    const products = db.prepare(`
        SELECT id, name, category, price
        FROM products
        WHERE secret = 0
    `).all();

    res.json(products);
});

// ================================
// PURCHASE
// ================================

app.post("/api/purchase", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "You must be logged in first."
        });
    }

    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID required."
        });
    }

    const product = db.prepare(`
        SELECT *
        FROM products
        WHERE id = ?
    `).get(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Article not found."
        });
    }

    // ==========================================
    // CTF FLAG
    // ==========================================

    if (product.secret === 1) {
        return res.json({
            success: true,
            purchased: true,
            message: "Congratulations! You bought the secret article.",
            flag: "CTF{achraf_sql_injection_sole}"
        });
    }

    res.json({
        success: true,
        purchased: true,
        message: `You purchased ${product.name} for $${product.price}.`
    });
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
    console.log("");
    console.log("====================================");
    console.log("        SOLE CTF SHOP");
    console.log("====================================");
    console.log(`Running at http://localhost:${PORT}`);
    console.log("");
    console.log("CTF objective:");
    console.log("1. Login as achraf");
    console.log("2. Exploit the SQL injection");
    console.log("3. Purchase the secret article");
    console.log("4. Capture the flag");
    console.log("");
});