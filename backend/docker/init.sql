-- MySQL Script generated by MySQL Workbench
-- Fri Apr  5 13:45:13 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- -----------------------------------------------------

-- -----------------------------------------------------
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `User` ;

CREATE TABLE IF NOT EXISTS `User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Account` ;

CREATE TABLE IF NOT EXISTS `Account` (
  `idAccount` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `type` ENUM('debit', 'credit') NOT NULL,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `limit` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `accountNumber` VARCHAR(255) NULL,
  UNIQUE INDEX `accountId_UNIQUE` (`idAccount` ASC) VISIBLE,
  PRIMARY KEY (`idAccount`),
  INDEX `fk_Account_User` (`User_id` ASC) VISIBLE,
  UNIQUE INDEX `AccountNumber_UNIQUE` (`accountNumber` ASC) VISIBLE,
  CONSTRAINT `fk_Account_User`
    FOREIGN KEY (`User_id`)
    REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Card`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Card` ;

CREATE TABLE IF NOT EXISTS `Card` (
  `idCard` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `pinHash` VARCHAR(255) NOT NULL,
  `number` VARCHAR(16) NOT NULL,
  `frozen` TINYINT NOT NULL DEFAULT 0,
  `failedPinAttempts` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idCard`),
  UNIQUE INDEX `idCard_UNIQUE` (`idCard` ASC) VISIBLE,
  INDEX `fk_Card_User1_idx` (`User_id` ASC) VISIBLE,
  UNIQUE INDEX `number_UNIQUE` (`number` ASC) VISIBLE,
  CONSTRAINT `fk_Card_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Transaction` ;

CREATE TABLE IF NOT EXISTS `Transaction` (
  `idTransaction` INT NOT NULL AUTO_INCREMENT,
  `Card_id` INT NULL DEFAULT NULL,
  `Account_id` INT NOT NULL,
  `dateTime` DATETIME NOT NULL,
  `balanceChange` DECIMAL(10,2) NOT NULL,
  `transactionType` ENUM('withdraw', 'deposit') NOT NULL,
  PRIMARY KEY (`idTransaction`),
  INDEX `fk_Transaction_Card_idx` (`Card_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`idTransaction` ASC) VISIBLE,
  INDEX `fk_Transaction_Account_idx` (`Account_id` ASC) VISIBLE,
  CONSTRAINT `fk_Transaction_Card`
    FOREIGN KEY (`Card_id`)
    REFERENCES `Card` (`idCard`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_Transaction_Account`
    FOREIGN KEY (`Account_id`)
    REFERENCES `Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Friend`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Friend` ;

CREATE TABLE IF NOT EXISTS `Friend` (
  `idFriend` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `Account_id` INT NOT NULL,
  INDEX `fk_Friend_Account_idx` (`Account_id` ASC) VISIBLE,
  PRIMARY KEY (`idFriend`),
  INDEX `fk_Friend_User` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Friend_User`
    FOREIGN KEY (`User_id`)
    REFERENCES `User` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Friend_Account`
    FOREIGN KEY (`Account_id`)
    REFERENCES `Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Card_Account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Card_Account` ;

CREATE TABLE IF NOT EXISTS `Card_Account` (
  `idCard_Account` INT NOT NULL AUTO_INCREMENT,
  `Card_id` INT NOT NULL,
  `Account_id` INT NOT NULL,
  PRIMARY KEY (`idCard_Account`),
  INDEX `fk_Card_Account_Card1_idx` (`Card_id` ASC) VISIBLE,
  INDEX `fk_Card_Account_Account1_idx` (`Account_id` ASC) VISIBLE,
  CONSTRAINT `fk_Card_Account_Card1`
    FOREIGN KEY (`Card_id`)
    REFERENCES `Card` (`idCard`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Card_Account_Account1`
    FOREIGN KEY (`Account_id`)
    REFERENCES `Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Administrator`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Administrator` ;

CREATE TABLE IF NOT EXISTS `Administrator` (
  `idAdministrator` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(255) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idAdministrator`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- procedure getCardAccounts
-- -----------------------------------------------------

DROP procedure IF EXISTS `getCardAccounts`;

CREATE PROCEDURE `getCardAccounts` (cardId INT)
BEGIN
	SELECT `accountNumber`, `type` FROM Account WHERE `idAccount` IN ( SELECT `Account_id` FROM Card_Account WHERE `Card_id` = cardId );
END;



DROP TRIGGER IF EXISTS `Account_BEFORE_INSERT` ;
CREATE DEFINER = CURRENT_USER TRIGGER `Account_BEFORE_INSERT` BEFORE INSERT ON `Account` FOR EACH ROW
BEGIN
SET NEW.`accountNumber` = UUID();
END;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
