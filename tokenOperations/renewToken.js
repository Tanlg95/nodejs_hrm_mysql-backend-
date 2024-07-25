require('dotenv').config();
const token = require('../tokenOperations/createToken');
const jwt = require('jsonwebtoken');

const newToken = function(atoken_old, ftoken)
{
    try{
        if(!atoken_old || !ftoken) throw new Error('please provide token!!!');
        // check old access token and old refresh token
        const check_atoken_old = jwt.verify(atoken_old, process.env.MYSQL_ACCESSTOKEN,{
            ignoreExpiration: true
        });
        const check_ftoken_old = jwt.verify(ftoken,process.env.MYSQL_REFRESHTOKEN);
        if(!check_atoken_old  || !check_ftoken_old) throw new Error('error!!! the old token is incorrect')
        // return access token and refresh token
        const payload = {
            accountId: check_ftoken_old.accountId,
            accountName: check_ftoken_old.accountName,
            email: check_ftoken_old.email
        }
        return {
            atoken: token(payload,1),
            ftoken: token(payload,2)
        }
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = newToken;