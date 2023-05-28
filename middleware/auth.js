 const jwt = require("jsonwebtoken")

 const auth = (req, res, next) => {
    
    let token = undefined
    if(req.cookies.token){
        token = req.cookies.token
    }
    
    else if (req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "")
    } 
    if(!token){
        res.status(403).send("Token is missing")
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decode
    } catch(error){
        console.log("test")
        return res.status(401).send("Invalid Token");
    }

    return next()
 
 }

 module.exports = auth