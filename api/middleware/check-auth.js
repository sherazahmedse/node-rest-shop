const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try 
    {
        console.log('Inside middleware');

        const headers = req.headers.authorization.split(' ');
        const token = headers[1];

        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.userData = decoded;
        next(); 
    } 
    catch (error) 
    {
        return res.status(201).json({
            message : "Auth failed"
        })
    }

}   