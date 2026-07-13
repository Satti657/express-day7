const express = require("express");

const app = express();



app.use(express.json());



const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");



app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);



app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running"
    });
});



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});