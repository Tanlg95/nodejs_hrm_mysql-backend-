require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = function(req,res,next)
{
    try {
        const tokenForAuth = req.body.atoken || req.query.atoken || req.headers["atoken"];
        if(!tokenForAuth) throw new Error('please provide a token for auth');
        const payload = jwt.verify(tokenForAuth, process.env.MYSQL_ACCESSTOKEN);
        if(!payload) throw new Error('verify error!!!');
        //console.log(payload);
        //res.status(200).send(payload);
        next();
    } catch (error) {
        throw error;    
    }
};


module.exports = auth;