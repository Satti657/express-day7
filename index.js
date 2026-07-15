require("dotenv").config();

const express = require("express");
const pool = require("./db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).send("Database connection failed");
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const result = await pool.query(
            `
            SELECT
                users.id AS user_id,
                users.name,
                users.email,
                tasks.id AS task_id,
                tasks.title,
                tasks.completed
            FROM users
            JOIN tasks
                ON users.id = tasks.user_id
            WHERE users.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching user details."
        });
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name is required."
            });
        }

        if (!email || typeof email !== "string" || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required."
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email.trim()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO users (name, email)
            VALUES ($1, $2)
            RETURNING *;
            `,
            [name.trim(), email.trim()]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error adding user."
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});