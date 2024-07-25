const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');

// get current position of employee

async function get_max_position(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const employeeId = (!body.employeeId) ? null : `'${body.employeeId}'`;
        // default current date if todate has null value
        const todate = (!body.todate) ? `'${new Date().toISOString().split('T')[0]}'`: `'${new Date(body.todate).toISOString().split('T')[0]}'` ;
        console.log(`check todate :${todate}`);
        const pool = await connection.promise().query(
            `
            WITH tblpos AS( 
                SELECT employeeId, 
                       datechange, 
                       posId, 
                       note, 
                       MAX(datechange) OVER(PARTITION BY employeeId) max_date
                FROM tblemppos
                WHERE datechange < DATE_ADD(${todate}, INTERVAL 1 DAY)
                AND employeeId LIKE IF(${employeeId} IS NULL, '%', CONCAT('%',${employeeId},'%'))
            )
            SELECT employeeId, datechange, posId, note
            FROM tblpos 
            WHERE datechange = max_date
            `
        );
        await connection.promise().commit();
        return pool[0];

    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

module.exports = {
    get_max_position: get_max_position,
};