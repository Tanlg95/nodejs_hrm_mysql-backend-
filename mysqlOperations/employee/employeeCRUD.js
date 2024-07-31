const mysql = require('mysql2');
const mysql_config = require('../../mysqlConfigure/mysqlConfig');
const statusClass = require('../../support/status');
const status = new statusClass();

// get employee information

async function get_employee_info(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        const employeeId = (!body.empid) ? null : `"${body.empid}"`;
        await connection.promise().beginTransaction();
        const todate = (!body.todate) ? `'${new Date().toISOString().split('T')[0]}'`: `'${new Date(body.todate).toISOString().split('T')[0]}'` ;
        const pool = await connection.promise().execute(
            `CALL usp_get_employee (${todate} ,${employeeId})`
        );
        await connection.promise().commit();
        return pool[0][0][0];
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}


// create employee information

async function insert_employee_info(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        // check valid input
        if(!(body.body instanceof Array)) throw status.errorStatus(1);
        const employeeListForInsert = [];
        // create an employee array
        for(let ele of body.body)
        {
            employeeListForInsert.push(
                {
                    employeeId: ele.employeeId,
                    employeeName:  ele.employeeName,
                    employedDate: (!ele.employedDate)? null : new Date(ele.employedDate).toISOString().split('T')[0],
                    birthDate: (!ele.birthDate)? null : new Date(ele.birthDate).toISOString().split('T')[0],
                    isActive: (!ele.isActive)? null : Boolean(ele.isActive)
                }
            )
        }
        await connection.promise().beginTransaction();
        // insert data
        const pool = await connection.promise().query(
            `INSERT INTO tblemployee(employeeId, employeeName, employedDate, birthDate, isActive) VALUES ?`,
            [employeeListForInsert.map((val) => [val.employeeId, val.employeeName, val.employedDate, val.birthDate, val.isActive])]
        );
        await connection.promise().commit();
        return {
            statusId: status.operationStatus(104),
            totalRowInserted: pool[0].affectedRows
        };

    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

// update employee information

async function update_employee_info(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const employee_information = {
            employeeName: (!body.employeeName) ? null : `'${body.employeeName}'`,
            employedDate: (!body.employedDate) ? null : `'${new Date(body.employedDate).toISOString().split('T')[0]}'`,
            birthDate: (!body.birthDate) ? null : `'${new Date(body.birthDate).toISOString().split('T')[0]}'`,
            isActive: (!body.isActive) ? null : Boolean(body.isActive),
            keyid: `'${body.keyid}'`
        };
        console.log(`check valid:${employee_information}`);
        const pool = await connection.promise().execute(
            `CALL usp_update_employee 
            (${employee_information.employeeName},
            ${employee_information.employedDate},
            ${employee_information.birthDate},
            ${employee_information.isActive},
            ${employee_information.keyid});`
        );
        await connection.promise().commit();
        return {
            statusId: status.operationStatus(104),
            totalRowModified: pool[0].affectedRows
        };
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

// update multi employee information

async function update_employee_info_multi(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();

        // check valid input
        if(!(body.body instanceof Array)) throw status.errorStatus(1);

        const tblemployee = body.body.map(
            val => ({
                employeeName: (!val.employeeName) ? null : val.employeeName,
                employedDate: (!val.employedDate) ? null : new Date(val.employedDate).toISOString().split('T')[0],
                birthDate: (!val.birthDate) ? null : new Date(val.birthDate).toISOString().split('T')[0],
                isActive: (!val.isActive) ? null : Boolean(val.isActive),
                keyid: val.keyid
            })
        );
        let queries = '';

        for(let ele of tblemployee)
        {
            queries += mysql.format('UPDATE tblemployee SET employeeName = ?, employedDate = ?, birthDate= ?, isActive = ? WHERE keyid = ? ;',
                [ele.employeeName, ele.employedDate, ele.birthDate, ele.isActive, ele.keyid]
            );
        }

        const pool = await connection.promise().query(queries);
        // const employee_information = {
        //     employeeName: (!body.employeeName) ? null : `'${body.employeeName}'`,
        //     employedDate: (!body.employedDate) ? null : `'${new Date(body.employedDate).toISOString().split('T')[0]}'`,
        //     birthDate: (!body.birthDate) ? null : `'${new Date(body.birthDate).toISOString().split('T')[0]}'`,
        //     isActive: (!body.isActive) ? null : Boolean(body.isActive),
        //     keyid: `'${body.keyid}'`
        // };
        // console.log(`check valid:${employee_information}`);
        // const pool = await connection.promise().execute(
        //     `CALL usp_update_employee 
        //     (${employee_information.employeeName},
        //     ${employee_information.employedDate},
        //     ${employee_information.birthDate},
        //     ${employee_information.isActive},
        //     ${employee_information.keyid});`
        // );
        await connection.promise().commit();
        return {
            statusId: status.operationStatus(104),
            totalRowModified: pool[0].filter(ele => ele.changedRows === 1).length
        };
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        await connection.promise().end();
    }
}

// delete employee information

async function delete_employee_info(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        const pool = await connection.promise().execute(
            `CALL usp_delete_employee ('${body.keyid}')`
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

// delete multi employee information

async function delete_employee_info_multi(body)
{
    const connection = mysql.createConnection(mysql_config);
    try {
        await connection.promise().beginTransaction();
        if(!(body.body) instanceof Array) throw status.errorStatus(1);
        const employeeForDelete = [];
        for(let ele of body.body)
        {
            employeeForDelete.push(
                {keyid: ele.keyid}
            );
        }
        // console.log(employeeForDelete);
        const pool = await connection.promise().query(
            `DELETE FROM tblemployee WHERE keyid IN (?)`,
            [employeeForDelete.map(val => [val.keyid])]
        );
        await connection.promise().commit();
        return {
            statusId: status.operationStatus(104),
            totalRowDeleted: pool[0].affectedRows
       };
    } catch (error) {
        await connection.promise().rollback();
        throw error;
    } finally
    {
        connection.promise().end();
    }
}

module.exports = {
    get_employee_info: get_employee_info,
    insert_employee_info: insert_employee_info,
    update_employee_info: update_employee_info,
    update_employee_info_multi: update_employee_info_multi,
    delete_employee_info: delete_employee_info,
    delete_employee_info_multi: delete_employee_info_multi
}