function validateTask(req, res, next) {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Task title is required."
        });
    }

    next();
}

module.exports = validateTask;