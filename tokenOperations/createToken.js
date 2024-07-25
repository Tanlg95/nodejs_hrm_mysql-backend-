require('dotenv').config();
const jwt = require('jsonwebtoken');

const createToken = function(payload,opt){

    // access token => opt: 1
    // refresh token => opt: 2
    if(!([1,2].includes(opt))) throw new Error('opt must be in (1,2)');
    try {
        let token = undefined;
        switch(opt)
        {
            case 1:
                token = jwt.sign(payload,process.env.MYSQL_ACCESSTOKEN,{
                    expiresIn: "30m"
                });
            break;
            case 2:
                token = jwt.sign(payload,process.env.MYSQL_REFRESHTOKEN,{
                    expiresIn: "60d"
                });
            break;
        }
    return token;
       
    } catch (error) {
        throw error
    }
};

module.exports = createToken;