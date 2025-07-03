const express = require("express");
const jwt = require("jsonwebtoken");
const { CreateUserSchema, SigninUserSchema, CreateBlogSchema } = require("./types");
const mongoose = require("mongoose");
const { UserModel, BlogModel } = require("./models");

mongoose.connect("your-mongo-url")

const app = express()
app.use(express.json())

app.post("/signup", (req, res) => {
    const {success, data} = CreateUserSchema.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    UserModel.create({
        username: data.username,
        password: data.password,
        name: data.name
    })

    res.json({
        message: "User created"
    })
})

app.post("/signin", (req, res) => {
    const {data, success} = SigninUserSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }

    UserModel.findOne({
        username: data.username,
        password: data.password
    }).then(user => {
        if (!user) {
            return res.status(403).json({
                message: "Incorrect credentials"
            })
        } else {
            let token = jwt.sign(username, "secret123");
            res.json({
                token: token
            })
        }
    })
})

app.post("/blog", (req, res) => {
    const token = req.headers.token;
    const username = jwt.verify(token, "secret123")

    const {success, data} = CreateBlogSchema.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    } 
    BlogModel.create({
        title: data.title,
        content: data.content,
        username: username
    })

    res.json({
        message: "Blog created"
    })
})

app.get("/blogs", (req, res) => {
    const token = req.headers.token;
    const username = jwt.verify(token, "secret123")

    BlogModel.findMany({
        username: username
    }).then(function(blogs) {
        res.json({
            blogs: blogs
        })
    })
})

app.get("/blog/:blogId", (req, res) => {
    const token = req.headers.token;
    const username = jwt.verify(token, "secret123")

    BlogModel.findOne({
        username: username,
        _id: req.params.blogId
    }).then(function(blog) {
        res.json({
            blog: blog
        })
    })
})

app.listen(3000);