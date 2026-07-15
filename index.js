require("dotenv").config();

const express = require("express");
const pool = require("./db");

const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


app.use(express.json());


app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);


app.get("/", async (req, res) => {
    try {

        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "API is running",
            time: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});