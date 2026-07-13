const express = require("express");
const router = express.Router();


const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");


const validateTask = require("../middleware/validateTask");



router.get("/", getTasks);



router.post("/", validateTask, createTask);



router.put("/:id", validateTask, updateTask);


router.delete("/:id", deleteTask);


module.exports = router;