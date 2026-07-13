const pool = require("../db");

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

async function createUser(req,res){

    try{

        const {name,email}=req.body;


        if(!name || !email){

            return res.status(400).json({
                success:false,
                message:"Name and email are required."
            });

        }


        const result = await pool.query(
            `
            INSERT INTO users(name,email)
            VALUES($1,$2)
            RETURNING *
            `,
            [name,email]
        );


        res.status(201).json({
            success:true,
            data:result.rows[0]
        });


    }
  catch(error){

    console.error(error);


    if(error.code === "23505"){

        return res.status(400).json({
            success:false,
            message:"Email already exists."
        });

    }


    res.status(500).json({
        success:false,
        message:"Error creating user."
    });

}

}
module.exports={
    getUser,
    createUser
}