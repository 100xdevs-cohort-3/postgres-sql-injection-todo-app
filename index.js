const jwt = require("jsonwebtoken")
const express = require("express");
const {Pool} = require("pg")

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_5AXnbWktNwm9@ep-odd-hall-a86hwjx8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
});

pool.connect().then(function(conn) {
    const app = express()
    app.use(express.json())
    
    app.post("/signup", (req, res) => {
        conn.query(`INSERT INTO users (username, password) VALUES ('${req.body.username}', '${req.body.password}');`)
        
        res.json({
            message: "User created"
        })
    })

    app.post("/signin", function(req, res) {
        const {username, password} = req.body;
        let rows = conn.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}'`)
            .then(({rows}) => {
                console.log(rows);
                let userId = rows[0].id;
                const token = jwt.sign(userId, "123random");
                res.json({
                    token
                })  
            });
    })
    app.post("/todos", function(req, res) {
        const token = req.headers.token;
        let userId = jwt.verify(token, "123random");
        conn.query(`INSERT INTO blogs (title, content, user_id) VALUES ('${req.body.title}', '${req.body.content}', '${userId}');`)

        res.json({
            message: "Todo inserted"
        })
    })
    app.get("/todos", function(req, res) {
        const token = req.headers.token;
        let userId = jwt.verify(token, "123random");
        conn.query(`SELECT * FROM blogs WHERE user_id='${userId}'`)
            .then(({rows}) => {
                res.json({
                    rows
                })
            });
    })

    // signin, create todos, get todos
    
    app.listen(3000);
});
