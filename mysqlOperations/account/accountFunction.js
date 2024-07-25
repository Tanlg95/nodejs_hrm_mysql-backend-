const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');
const bcrypt = require('bcrypt');


// login account

async function login(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const accountId = `'${body.accountId}'`;
        // get the password for compare
        const get_password = await connection.promise().query(
            `SELECT accountId, atoken, pwd FROM tblaccount WHERE accountId = ${accountId}`
        );
        await connection.promise().commit();
        // compare passwords
        const check_password = bcrypt.compareSync(body.pwd,get_password[0][0].pwd);
        if(!check_password) throw new Error('incorrect password or keyid !!!');
        // return employee's information
        return {
            statusId: 1,
            accountId: get_password[0][0].accountId,
            statusName: "logged in successfully!!!",
            atoken: get_password[0][0].atoken
        };
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
};


// change password

async function changePassword(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const accountId = `'${body.accountId}'`;
        // get the password for compare
        const get_password = await connection.promise().query(
            `SELECT accountId, atoken, pwd FROM tblaccount WHERE accountId = ${accountId}`
        );
        // compare passwords
        const check_password = bcrypt.compareSync(body.pwd,get_password[0][0].pwd);
        if(!check_password) throw new Error('incorrect password or keyid !!!');
        // create a new password
        const new_password = `'${bcrypt.hashSync(body.new_password, bcrypt.genSaltSync(10))}'`;
        // update password
        const pool = await connection.promise().execute(
            `CALL usp_change_account_password (${accountId}, ${new_password})`
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
    login: login,
    changePassword: changePassword
};