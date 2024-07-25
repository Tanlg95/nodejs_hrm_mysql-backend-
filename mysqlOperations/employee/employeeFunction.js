const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');

// get the number of total employee


async function get_total_employee(todate)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const todateFormat = (!todate) ? `'${new Date().toISOString().split('T')[0]}'`: `'${new Date(todate).toISOString().split('T')[0]}'` ;
        const pool = await connection.promise().query(
            `SELECT count(employeeId) total_employee FROM tblemployee WHERE employedDate < DATE_ADD(${todateFormat}, INTERVAL 1 DAY)`
        );
        await connection.promise().commit();
        return pool[0][0];
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
};

module.exports = {
    get_total_employee: get_total_employee,
};