const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({'message': 'Access Denied. No token Provided'});

    try{
        const decoded = jwt.verify(token, process.env.PRIVATEKEY);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(400).json({'message': 'Invalid Token'})
    }
}