const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
require("./config/database").connect()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")
const app = express()
app.use(express.json())
var cookieParser = require("cookie-parser");
app.use(cookieParser());
const User = require("./model/user")


app.get('/', (req, res) => {
    console.log("Test")
    res.send("Hello from auth system")
})


app.post("/register", async (req, res) => {

    try {
        const { firstName, lastName, email, passWord } = req.body

        if (!(firstName && lastName && email && passWord)) {
            res.status(400).send("All fields are required")
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).send("user already exists")
        }

        const myEncPassword = await bcrypt.hash(passWord, 10)

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            passWord: myEncPassword
        })

        const token = jwt.sign({
            user_id: user._id, email
        },
            process.env.SECRET_KEY,
            {
                expiresIn: "2h"
            }
        )
 
        user.token = token
        // TODO: Handle password situation
  
        user.passWord = undefined
        // Update or not in DB


        
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req, res) => {
    try{
        const { email, passWord } = req.body
        if (!(email && passWord)){
            res.status(400).send("Fields are missing ")
        }

        const user = await User.findOne({email})
        if( user && await bcrypt.compare(passWord, user.passWord)){
            const token = await jwt.sign({
                user_id: user._id,
                email
            },
            process.env.SECRET_KEY,
            {
                expiresIn : "2h"
            })

            
            user.token = token
            user.passWord = undefined

            // res.status(200).json(user)

            //  If you want to use cookies 
            const option = {
                expires : new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.status(200).cookie("token", token, option).json({
                success: true,
                token,
                user
            })
        }


        res.status(400).send("Invalid credentials")


    } catch(error){
        console.log(error)
    }
})

app.post("/dashboard", auth,  (req,res) => {
    res.status(200).send("Ristricted message")
})

app.post('/logout',  (req, res) => {

    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "")

    if (!token){
        res.status(400).send("You are not loggedIn")
    }
    
    const option = {
        expires : new Date( Date.now()),
        httpOnly: true,
    }

    res.status(200).cookie("token", token, option).json({
        success: true
    })

})



module.exports = app