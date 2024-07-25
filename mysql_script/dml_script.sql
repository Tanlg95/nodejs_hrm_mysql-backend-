DELETE FROM tblref_position;
INSERT tblref_position(posId, posName)
VALUES('NV','nhân viên'),
('TN','trưởng nhóm'),
('PN','phó nhóm'),
('QL','quản lý'),
('PQL','phó quản lý'),
('PP','phó phòng'),
('TP','trưởng phòng'),
('GD','giám đốc'),
('PGD','phó giám đốc'),
('TGD','tổng giám đốc'),
('BV','bảo vệ');

/*------------------------------ employee --------------------------*/

-- create procedure auto generate employee information
DROP TABLE IF EXISTS tblname1;
CREATE TABLE tblname1(
	keyid INT AUTO_INCREMENT,
    employeeName VARCHAR(100),
    PRIMARY KEY(keyid)
);
DROP TABLE IF EXISTS tblname2;
CREATE TABLE tblname2(
	keyid INT AUTO_INCREMENT,
    employeeName VARCHAR(100),
    PRIMARY KEY(keyid)
);
DROP TABLE IF EXISTS tblname3;
CREATE TABLE tblname3(
	keyid INT AUTO_INCREMENT,
    employeeName VARCHAR(100),
    PRIMARY KEY(keyid)
);
INSERT INTO tblname1
VALUES(1 	,'Huy'),
(2 	,'Khang'),
(3 	,'Bảo'),
(4 	,'Minh'),
(5 	,'Phúc'),
(6 	,'Anh'),
(7 	,'Khoa'),
(8 	,'Phát'),
(9 	,'Đạt'),
(10 	,'Khôi'),
(11 	,'Long'),
(12 	,'Nam'),
(13 	,'Duy'),
(14 	,'Quân'),
(15 	,'Kiệt'),
(16 	,'Thịnh'),
(17 	,'Tuấn'),
(18 	,'Hưng'),
(19 	,'Hoàng'),
(20 	,'Hiếu'),
(21 	,'Nhân'),
(22 	,'Trí'),
(23 	,'Tài'),
(24 	,'Phong'),
(25 	,'Nguyên'),
(26 	,'An'),
(27 	,'Phú'),
(28 	,'Thành'),
(29 	,'Đức'),
(30 	,'Dũng'),
(31 	,'Lộc'),
(32 	,'Khánh'),
(33 	,'Vinh'),
(34 	,'Tiến'),
(35 	,'Nghĩa'),
(36 	,'Thiện'),
(37 	,'Hào'),
(38 	,'Hải'),
(39 	,'Đăng'),
(40 	,'Quang'),
(41 	,'Lâm'),
(42 	,'Nhật'),
(43 	,'Trung'),
(44 	,'Thắng'),
(45 	,'Tú'),
(46 	,'Hùng'),
(47 	,'Tâm'),
(48 	,'Sang'),
(49 	,'Sơn'),
(50 	,'Thái'),
(51 	,'Cường'),
(52 	,'Vũ'),
(53 	,'Toàn'),
(54 	,'Ân'),
(55 	,'Thuận'),
(56 	,'Bình'),
(57 	,'Trường'),
(58 	,'Danh'),
(59 	,'Kiên'),
(60 	,'Phước'),
(61 	,'Thiên'),
(62 	,'Tân'),
(63 	,'Việt'),
(64 	,'Khải'),
(65 	,'Tín'),
(66 	,'Dương'),
(67 	,'Tùng'),
(68 	,'Quý'),
(69 	,'Hậu'),
(70 	,'Trọng'),
(71 	,'Triết'),
(72 	,'Luân'),
(73 	,'Phương'),
(74 	,'Quốc'),
(75 	,'Thông'),
(76 	,'Khiêm'),
(77 	,'Hòa'),
(78 	,'Thanh'),
(79 	,'Tường'),
(80 	,'Kha'),
(81 	,'Vỹ'),
(82 	,'Bách'),
(83 	,'Khanh'),
(84 	,'Mạnh'),
(85 	,'Lợi'),
(86 	,'Đại'),
(87 	,'Hiệp'),
(88 	,'Đông'),
(89 	,'Nhựt'),
(90 	,'Giang'),
(91 	,'Kỳ'),
(92 	,'Phi'),
(93 	,'Tấn'),
(94 	,'Văn'),
(95 	,'Vương'),
(96 	,'Công'),
(97 	,'Hiển'),
(98 	,'Linh'),
(99 	,'Ngọc'),
(100 ,'Vĩ');
INSERT INTO tblname2 SELECT * FROM tblname1;
INSERT INTO tblname3 SELECT * FROM tblname1;
UPDATE tblname1 SET employeeName = TRIM( ' ' FROM employeeName);
UPDATE tblname2 SET employeeName = TRIM( ' ' FROM employeeName);
UPDATE tblname3 SET employeeName = TRIM( ' ' FROM employeeName);

INSERT INTO tblemployee(employeeId, employeeName, employedDate, birthDate, isActive)
VALUES('SIV00001','leung daniel','2024-05-01','1995-09-24',1);

-- store procedure gen employee
DROP PROCEDURE IF EXISTS usp_gen_employee;
DELIMITER $$
CREATE PROCEDURE usp_gen_employee(totalemployee INT)
BEGIN
	SET @get_max_id = CASE WHEN (SELECT max(CAST(RIGHT(employeeId,5) AS DECIMAL(10,0))) max_id FROM tblemployee) IS NULL 
    THEN 0 ELSE  (SELECT max(CAST(RIGHT(employeeId,5) AS DECIMAL(10,0))) max_id FROM tblemployee) END + 1;
    SET @begin = 0;
    SET @end = totalemployee;
	WHILE @begin < @end + 1
    DO
		SET @rand_keyid_Name = CEILING(RAND() * 100);
        SET @rand_keyid_Name1 = CEILING(RAND() * 100);
        SET @rand_keyid_Name2 = CEILING(RAND() * 100);
        SET @randName = CONCAT(
			(SELECT employeeName FROM tblname1 WHERE keyid = @rand_keyid_Name),
            ' ',
            (SELECT employeeName FROM tblname2 WHERE keyid = @rand_keyid_Name1),
            ' ',
            (SELECT employeeName FROM tblname3 WHERE keyid = @rand_keyid_Name2));
		-- SELECT @randName;
        SET @employedDate = DATE_ADD( CAST('2000-01-01' AS DATE), INTERVAL CEILING(RAND() * 10000) DAY );
		-- employee's birth date
		SET @birthDate = DATE_ADD(CAST('1980-01-01' AS DATE), INTERVAL CEILING(RAND() * 13000) DAY);
		-- employee's active
		SET @isActive = IF( CEILING(RAND() * 10) < 7, 1, 0);
		
		SET @employeeId = 
			CASE WHEN @get_max_id > -1 AND @get_max_id < 10 THEN CONCAT('SIV0000' , CAST(@get_max_id AS CHAR(10)))
				 WHEN @get_max_id >= 10 AND @get_max_id < 100 THEN CONCAT('SIV000' , CAST(@get_max_id AS CHAR(10)))
				 WHEN @get_max_id >= 100 AND @get_max_id < 1000 THEN CONCAT('SIV00' , CAST(@get_max_id AS CHAR(10)))
				 WHEN @get_max_id >= 1000 AND @get_max_id < 10000 THEN CONCAT('SIV0' , CAST(@get_max_id AS CHAR(10)))
				 WHEN @get_max_id >= 10000 AND @get_max_id < 100000 THEN CONCAT('SIV' , CAST(@get_max_id AS CHAR(10))) END;
        
        INSERT tblemployee(employeeId, employeeName, employedDate, birthDate, isActive)
		VALUES(@employeeId, @randName, @employedDate, @birthDate, @isActive);
        
	SET @begin = @begin + 1;
    SET @get_max_id = @get_max_id + 1;
    END WHILE;    
END; $$
/* how to use */
-- CALL usp_gen_employee(1000);
-- SELECT * FROM tblemployee ORDER BY employeeId DESC;

SHOW FULL PROCESSLIST;


/*------------------------------ position --------------------------*/

-- generate employee's position

DELETE FROM tblemppos;
DROP PROCEDURE IF EXISTS usp_gen_pos;
DELIMITER $$
CREATE PROCEDURE usp_gen_pos()
BEGIN
    DECLARE out_v BOOLEAN DEFAULT FALSE;
	DECLARE employeeId_V CHAR(10) DEFAULT '';
    DECLARE employedDate_V DATE DEFAULT CURRENT_DATE();
	DECLARE curv CURSOR FOR SELECT employeeId, employedDate FROM tblemployee;
	DECLARE EXIT HANDLER FOR NOT FOUND SET out_v = TRUE;
    OPEN curv;
    START TRANSACTION;
	wl:LOOP  FETCH NEXT FROM curv INTO employeeId_V, employedDate_V;
		IF( out_v = TRUE)
        THEN
			LEAVE wl;
		END IF;
		SET @rand_number_pos = CAST(CEILING(RAND()* 11) AS DECIMAL(2,0));
		SET @rand_posId = (SELECT posId FROM tblref_position WHERE keyid = @rand_number_pos  LIMIT 1);
		IF NOT EXISTS (SELECT 1 FROM tblemppos WHERE employeeId = employeeId_V LIMIT 1)
		THEN
			INSERT INTO tblemppos(employeeId,datechange,posId)
			VALUES(employeeId_V, employedDate_V,@rand_posId);
		END IF;
	END LOOP;
	CLOSE curv;
	COMMIT;
END; $$
-- just only use one time
-- how to use 
/*
	CALL usp_gen_pos 
*/

-- do you want to create more positions for employees ? 
-- just use store employee.usp_gen_pos_ad 
DROP PROCEDURE IF EXISTS usp_gen_pos_ad;
DELIMITER $$
CREATE PROCEDURE usp_gen_pos_ad(totalEmployee INT)
BEGIN
	DECLARE employeeId_V CHAR(10) DEFAULT '';
    DECLARE datechange_V DATE DEFAULT CURRENT_DATE();
    DECLARE posId_V CHAR(10) DEFAULT '';
    DECLARE out_V BOOLEAN DEFAULT FALSE;
    DECLARE curv CURSOR FOR 
			SELECT p.employeeId, p.datechange, p.posId
            FROM tblemppos p
            INNER JOIN (
				SELECT employeeId, MAX(datechange) max_date
                FROM tblemppos
                GROUP BY employeeId
            )sub ON p.employeeId = sub.employeeId AND p.datechange = sub.max_date
			LIMIT totalEmployee;
	DECLARE EXIT HANDLER FOR NOT FOUND SET out_V = TRUE;
    OPEN curv;
    wl:LOOP FETCH NEXT FROM curv INTO employeeId_V, datechange_V, posId_V;
		IF( out_V = TRUE)
        THEN LEAVE wl;
        END IF;
        SET @rand_datechange = DATE_ADD( datechange_V, INTERVAL CEILING(RAND() * 365.0) DAY );
        SET @rand_number_pos = CAST(CEILING(RAND()* 11) AS DECIMAL(2,0));
		SET @rand_posId = (SELECT posId FROM tblref_position WHERE keyid = @rand_number_pos  LIMIT 1);
        IF NOT EXISTS (SELECT 1 FROM tblemppos WHERE employeeId = employeeId_V AND posId = @rand_posId AND datechange = @rand_datechange)
		THEN
			INSERT INTO tblemppos(employeeId,datechange,posId)
			VALUES(employeeId_V, @rand_datechange,@rand_posId);
		END IF;
    END LOOP;
    CLOSE curv;
END;
/* how to use 
SET @total_emp_pos = 500;
CALL usp_gen_pos_ad (@total_emp_pos)
SELECT * FROM tblemppos;
*/
