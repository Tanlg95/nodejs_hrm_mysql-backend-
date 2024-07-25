CREATE DATABASE hrm_mysql;
USE hrm_mysql;
-- create table employee information
DROP TABLE IF EXISTS tblemployee;
CREATE TABLE tblemployee(
	employeeId CHAR(10),
    employeeName NVARCHAR(250),
    employedDate DATE,
    birthDate DATE,
    isActive BIT,
    keyid VARCHAR(50) DEFAULT (UUID()),
    CONSTRAINT cs_pk_tblemployee PRIMARY KEY(employeeId)
)ENGINE = INNODB;

-- create table employee's position
DROP TABLE IF EXISTS tblref_position;
CREATE TABLE tblref_position(
	posId CHAR(10) unique,
	posName VARCHAR(150),
	note VARCHAR(250),
    keyid INT AUTO_INCREMENT,
	CONSTRAINT pk_tblref_position PRIMARY KEY(keyid)
)ENGINE = INNODB;

DROP TABLE IF EXISTS tblemppos;
CREATE TABLE tblemppos(
	employeeId CHAR(10),
	datechange DATE,
	posId CHAR(10),
	note VARCHAR(250),
    keyid VARCHAR(50) DEFAULT(UUID()),
	CONSTRAINT pk_tblemppos PRIMARY KEY (employeeId , datechange DESC),
	CONSTRAINT fk_tblemppos_1 FOREIGN KEY(employeeId) REFERENCES tblemployee(employeeId) ON UPDATE CASCADE,
	CONSTRAINT fk_tblemppos_2 FOREIGN KEY(posId) REFERENCES tblref_position(posId) ON UPDATE CASCADE
)ENGINE = INNODB;

-- create table account
DROP TABLE IF EXISTS tblaccount;
CREATE TABLE tblaccount(
	accountId CHAR(10),
	accountName VARCHAR(150),
	email VARCHAR(150),
	pwd VARCHAR(1000),
	atoken VARCHAR(1500),
	ftoken VARCHAR(1500),
	note VARCHAR(250),
	keyid VARCHAR(50) DEFAULT(UUID()),
    CONSTRAINT cs_pk_tblaccount PRIMARY KEY(accountId)
)ENGINE = INNODB;


