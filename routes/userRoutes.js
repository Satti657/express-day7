const express = require("express");

const router = express.Router();

const {
    getUser,
    createUser
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

router.get("/:id", getUser);

router.post("/", validateUser, createUser);

module.exports = router;