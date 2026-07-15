const pool = require("../db");
const bcrypt = require("bcrypt");



async function getUser(req, res) {
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
}





async function createUser(req, res) {

    try {

        const { name, email, password } = req.body;


    
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

       
        const hashedPassword = await bcrypt.hash(password, 10);
        


        const result = await pool.query(
            `
            INSERT INTO users(name,email,password)
            VALUES($1,$2,$3)
            RETURNING *
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );



        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: result.rows[0]
        });



    } catch (error) {


        console.error(error);



        
        if (error.code === "23505") {

            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });

        }



        res.status(500).json({
            success: false,
            message: "Error creating user."
        });

    }

}






async function loginUser(req, res) {

    try {


        const { email, password } = req.body;



        
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }



        
        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );



        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }



        const user = result.rows[0];



        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );



        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }



        res.status(200).json({

            success: true,

            message: "Login successful.",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });



    } catch (error) {


        console.error(error);


        res.status(500).json({
            success: false,
            message: "Error during login."
        });

    }

}




module.exports = {
    getUser,
    createUser,
    loginUser
};