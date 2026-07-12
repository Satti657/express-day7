const express = require("express");
const pool = require("./db");

require("dotenv").config();

const app = express();

app.use(express.json());


app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database connection failed");
    }
});


app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                tasks.id,
                tasks.title,
                tasks.completed,
                users.name,
                users.email
            FROM tasks
            JOIN users
            ON tasks.user_id = users.id
            `
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching tasks");
    }
});


app.post("/tasks", async (req, res) => {
    try {
        const { title, user_id } = req.body;

        const result = await pool.query(
            "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
            [title, user_id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding task");
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id=$1 RETURNING *",
            [id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting task");
    }
});


app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const result = await pool.query(
            "UPDATE tasks SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
            [title, completed, id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating task");
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

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
            WHERE users.id=$1
            `,
            [id]
        );

        res.json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching user details");
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;

        const result = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding user");
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});