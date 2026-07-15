const express = require("express");

const router = express.Router();

const {
    getUser,
    createUser,
    loginUser
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

router.get("/:id", getUser);

router.post("/", validateUser, createUser);

router.post("/login", loginUser);


module.exports = router;