const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');
const bcrypt = require('bcrypt');
const createToken = require('../../tokenOperations/createToken');
const renewToken = require('../../tokenOperations/renewToken');
// const moment = require('moment');

// create account

async function create_account(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();   

        if(!(body.body instanceof Array)) throw new Error('body must be an array!!!');
        const request = body.body.map(
            function(val)
            {
                const payloadForToken = {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: val.email
                };
                const atoken = createToken(payloadForToken,1),
                      ftoken = createToken(payloadForToken,2);
                return {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: val.email,
                    pwd: bcrypt.hashSync(val.pwd, bcrypt.genSaltSync(10)), // create encrypt password
                    atoken: atoken,
                    ftoken: ftoken,
                    note: val.note
                }
            });
        const pool = await connection.promise().query(
            `INSERT INTO tblaccount(accountId, accountName, email, pwd, atoken, ftoken, note) VALUES ?`,
            [request.map(val => [val.accountId, val.accountName, val.email, val.pwd , val.atoken, val.ftoken, val.note])]
        );
        await connection.promise().commit();
        return pool;
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

// update account's information

async function update_account(body)
{
   const connection = mysql.createConnection(mysql_config);
   try {
       await connection.promise().beginTransaction();
       const accountForUpdate = {
            accountName: (!body.accountName)? null : `'${body.accountName}'`,
            email: (!body.email)? null : `'${body.email}'`,
            note: (!body.note)? null : `'${body.note}'`,
            keyid: `'${body.keyid}'`
       }
       const pool = await connection.promise().execute(
            `CALL usp_update_account (${accountForUpdate.accountName}, ${accountForUpdate.email}, ${accountForUpdate.note}, ${accountForUpdate.keyid})`
       );
       await connection.promise().commit();
       return pool;
   } catch (error) {
       await connection.promise().rollback();
       throw error;
   } finally
   {
       await connection.promise().end();
   }
}

// delete account

async function delete_account(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        if(!(body.body) instanceof Array) throw new Error('body must be an array!!!');
        const accountForDelete = [];
        for(let ele of body.body)
        {
            accountForDelete.push(
                {keyid: ele.keyid}
            );
        }
        console.log(accountForDelete);
        const pool = await connection.promise().query(
            `DELETE FROM tblaccount WHERE keyid IN (?)`,
            [accountForDelete.map(val => [val.keyid])]
        );
        await connection.promise().commit();
        return pool;
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        connection.promise().end();
    }
}

// update token

async function update_token_account(body)
{
    /*
    -- opt: 0 => atoken and ftoken
	-- opt: 1 => atoken
	-- opt: 2 => ftoken
    */
    const connection = mysql.createConnection(mysql_config);
    if(!([0,1,2].includes(body.opt))) throw new Error('opt must be in (0,1,2)');
    try {
        await connection.promise().beginTransaction();
        const token = renewToken(body.atoken_old, body.ftoken);
        const empposListForUpdate = {
            atoken: `'${token.atoken}'`,
            ftoken: `'${token.ftoken}'`,
            keyid: `'${body.keyid}'`,
            opt: body.opt
        };
        const pool = await connection.promise().execute(
            `CALL usp_update_token (${empposListForUpdate.keyid}, ${empposListForUpdate.atoken}, ${empposListForUpdate.ftoken}, ${empposListForUpdate.opt})`
        );
        await connection.promise().commit();
        return pool;
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

module.exports = {
    create_account: create_account,
    update_account: update_account,
    delete_account: delete_account,
    update_token_account: update_token_account,
};