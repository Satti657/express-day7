const express = require("express");
const pool = require("./db");

require("dotenv").config();

const app = express();

app.use(express.json());


// Database test
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database connection failed");
    }
});


// GET all tasks
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching tasks");
    }
});


// POST create task
app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        const result = await pool.query(
            "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
            [title]
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


// Start server (always last)
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
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