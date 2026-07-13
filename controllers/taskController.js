const pool = require("../db");

async function getTasks(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                tasks.id,
                tasks.title,
                tasks.completed,
                users.name,
                users.email
            FROM tasks
            JOIN users
            ON tasks.user_id = users.id
        `);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching tasks."
        });
    }
}

async function createTask(req, res) {
    try {

        const { title, user_id } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required."
            });
        }

        if (!Number.isInteger(Number(user_id))) {
            return res.status(400).json({
                success: false,
                message: "Valid user_id is required."
            });
        }

        const result = await pool.query(
            "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
            [title.trim(), user_id]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error adding task."
        });
    }
}

async function updateTask(req, res) {
    try {

        const id = Number(req.params.id);
        const { title, completed } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID."
            });
        }

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required."
            });
        }

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Completed must be true or false."
            });
        }

        const result = await pool.query(
            "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
            [title.trim(), completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error updating task."
        });
    }
}

async function deleteTask(req, res) {
    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID."
            });
        }

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error deleting task."
        });

    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};