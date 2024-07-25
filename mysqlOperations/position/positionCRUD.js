const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');


// get employee's position

async function get_position_employee(body)
{
   const connection = mysql.createConnection(mysql_config);
   try {
        await connection.promise().beginTransaction();
        const todate = (!body.todate) ? `'${new Date().toISOString().split('T')[0]}'`: `'${new Date(body.todate).toISOString().split('T')[0]}'` ;
        const empid = (!body.empid) ? null : `'${body.empid}'`;
        const pool = await connection.promise().execute(
            `CALL usp_get_position (${todate}, ${empid})`
        );
        await connection.promise().commit();
        return  pool;

   } catch (error) {
        await connection.promise().rollback();
        throw error;
   } finally
   {
        await connection.promise().end();
   }
};

// create employee's position

async function insert_position_employee(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        if(!(body.body instanceof Array)) throw new Error(`body must be an array!!!`);
        const empposListForInsert = [];
        for(let ele of body.body)
        {
            empposListForInsert.push(
                {
                    employeeId: ele.employeeId,
                    datechange: new Date(ele.datechange).toISOString().split('T')[0],
                    posId: ele.posId,
                    note: ele.note
                }
            );
        }
        const pool = await connection.promise().query(
            `INSERT INTO tblemppos(employeeId, datechange, posId, note) VALUES ?`,
            [empposListForInsert.map(val => [val.employeeId, val.datechange, val.posId, val.note])]
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

// update employee's position

async function update_position_employee(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const empposListForUpdate = {
            datechange: (!body.datechange)? null : `'${new Date(body.datechange).toISOString().split('T')[0]}'`,
            posId: (!body.posId) ? null : `'${body.posId}'`,
            note: (!body.note) ? null : `'${body.note}'`,
            keyid: `'${body.keyid}'`
        };
        const pool = connection.promise().execute(
            `CALL usp_update_position (${empposListForUpdate.datechange}
            ,${empposListForUpdate.posId}
            ,${empposListForUpdate.note}
            ,${empposListForUpdate.keyid});`
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

// delete employee's position

async function delete_position_employee(keyid)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const pool = connection.promise().execute(
            `CALL usp_delete_position ('${keyid}')`
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
    get_position_employee: get_position_employee,
    insert_position_employee: insert_position_employee,
    update_position_employee: update_position_employee,
    delete_position_employee: delete_position_employee

};