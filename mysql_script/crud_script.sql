/* --------------------- employee -------------------------- */

-- get employee's information
DROP PROCEDURE IF EXISTS usp_get_employee;
DELIMITER $$
CREATE PROCEDURE usp_get_employee(todate DATE, empid CHAR(10))
BEGIN
	SELECT employeeId, employeeName, employedDate, birthDate, isActive
    FROM tblemployee
    WHERE employedDate < IF(todate IS NULL , DATE_ADD( CURRENT_DATE(), INTERVAL 1 DAY), DATE_ADD( todate, INTERVAL 1 DAY ))
    AND employeeId LIKE IF( empid IS NULL, '%', CONCAT('%', empid, '%'));
END; $$
-- CALL usp_get_employee (NULL,NULL);

-- update employee 
DROP PROCEDURE IF EXISTS usp_update_employee;
DELIMITER $$
CREATE PROCEDURE usp_update_employee(
	employeeName_V VARCHAR(150),
    employedDate_V DATE,
    birthDate_V DATE,
    isActive_V BOOLEAN,
    keyid_V VARCHAR(50)
)
BEGIN
	UPDATE tblemployee 
    SET employeeName  = IF(employeeName_V IS NULL, employeeName, employeeName_V),
		employedDate = IF(employedDate_V IS NULL, employedDate, employedDate_V),
        birthDate = IF(birthDate_V IS NULL, birthDate, birthDate_V),
        isActive = IF(isActive_v IS NULL, isActive, isActive_V)
	WHERE keyid = keyid_V;
END; $$
-- SELECT * FROM tblemployee ORDER BY employeeId DESC;

-- delete employee
DROP PROCEDURE IF EXISTS usp_delete_employee;
DELIMITER $$
CREATE PROCEDURE usp_delete_employee(keyid_V VARCHAR(50))
BEGIN
	DELETE FROM tblemployee WHERE keyid = keyid_V;
END; $$

/* --------------------- position -------------------------- */

-- get employee's position
DROP PROCEDURE IF EXISTS usp_get_position;
DELIMITER $$
CREATE PROCEDURE usp_get_position(todate DATE, empid CHAR(10))
BEGIN
	SELECT employeeId, datechange, posId, note
    FROM tblemppos
    WHERE datechange < DATE_ADD( todate, INTERVAL 1 DAY)
    AND employeeId LIKE IF(empid IS NULL, '%', CONCAT('%', empid, '%'));
END;
CALL usp_get_position('2024-10-10',NULL);

-- update employee's position
DROP PROCEDURE IF EXISTS usp_update_position;
DELIMITER $$
CREATE PROCEDURE usp_update_position(
	datechange_V DATE,
    posId_V CHAR(10),
    note_V VARCHAR(150),
    keyid_V VARCHAR(50)
)
BEGIN
	UPDATE tblemppos 
    SET datechange = IF( datechange_V IS NULL, datechange, datechange_V),
		posId = IF( posId_V IS NULL, posId, posId_V),
        note = IF( note_V IS NULL, note, note_v )
	WHERE keyid = keyid_V;
END; $$

-- delete employee's position
DROP PROCEDURE IF EXISTS usp_delete_position;
DELIMITER $$
CREATE PROCEDURE usp_delete_position(keyid_V VARCHAR(50))
BEGIN
	DELETE FROM tblemppos 
    WHERE keyid = keyid_V;
END; $$


/*--------------------------- account ----------------------------------------*/

-- store update employee's account information

DROP PROCEDURE IF EXISTS usp_update_account;
DELIMITER $$
CREATE PROCEDURE usp_update_account(
	-- accountId_V CHAR(10),
	accountName_V VARCHAR(150),
	email_V VARCHAR(150),
	note_V NVARCHAR(250),
	keyid_V VARCHAR(50) )
BEGIN
	UPDATE tblaccount
	SET accountName = IF(accountName_V IS NULL, accountName, accountName_V),
		email = IF(email_V IS NULL, email, email_V),
		note = note_V
	WHERE keyid = keyid_V;
END; $$

-- store update account's token 
DROP PROCEDURE IF EXISTS usp_update_token;
DELIMITER $$
CREATE PROCEDURE usp_update_token(
	keyid_V VARCHAR(50),
	atoken_V VARCHAR(1500),
	ftoken_V VARCHAR(1500),
	opt TINYINT)
BEGIN
	-- opt: 0 => atoken and ftoken
	-- opt: 1 => atoken
	-- opt: 2 => ftoken
	IF(opt = 0)
	THEN
		UPDATE tblaccount 
		SET atoken = atoken_V,
			ftoken = ftoken_V
		WHERE keyid = keyid_V;
	END IF;
	IF(opt = 1)
	THEN
		UPDATE tblaccount SET atoken = atoken_V
		WHERE keyid = keyid_V;
	ELSE
		UPDATE tblaccount SET ftoken = ftoken_V
		WHERE keyid = keyid_V;
	END IF;
END; $$

-- store change password

DROP PROCEDURE IF EXISTS usp_change_account_password;
DELIMITER $$
CREATE PROCEDURE usp_change_account_password(
	accountId_V CHAR(10),
	new_password VARCHAR(1000)
)
BEGIN
		UPDATE tblaccount
		SET pwd = new_password
		WHERE accountId = accountId_V;
END; $$

