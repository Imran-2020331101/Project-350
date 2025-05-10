const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyJwt = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.Status(403).send("invalid token"); //invalid token
        req.emial = decoded.UserInfo.email;
        req.roles = decoded.UserInfo.roles;
        return next();
    });
};

module.exports = verifyJwt;
