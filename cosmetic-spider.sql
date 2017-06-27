# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: v2_okoer
# Generation Time: 2017-02-27 02:09:51 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table cosmetic_attachment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_attachment`;

CREATE TABLE `cosmetic_attachment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fid` char(100) NOT NULL DEFAULT '',
  `processid` char(100) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `fileSize` int(11) DEFAULT NULL,
  `fileType` char(10) DEFAULT NULL,
  `postedTime` date DEFAULT NULL,
  `savePath` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fid` (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# Dump of table cosmetic_details
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_details`;

CREATE TABLE `cosmetic_details` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `processid` varchar(255) NOT NULL DEFAULT '',
  `apply_date` date NOT NULL,
  `productname` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `org_name` varchar(255) DEFAULT NULL,
  `org_code` varchar(255) DEFAULT NULL,
  `launch_date` date DEFAULT NULL,
  `is_entrust` char(5) DEFAULT NULL,
  `is_auto_product` char(5) DEFAULT NULL,
  `sid` varchar(255) DEFAULT NULL,
  `flow_name` varchar(255) DEFAULT NULL,
  `enterprise_sn` char(100) DEFAULT NULL,
  `displayname` char(100) DEFAULT NULL,
  `apply_sn` varchar(255) DEFAULT NULL,
  `applytype` char(5) DEFAULT NULL,
  `enterprise_name` char(100) DEFAULT NULL,
  `enterprise_address` varchar(255) DEFAULT NULL,
  `real_enterprise_name` char(100) DEFAULT NULL,
  `real_enterprise_address` varchar(255) DEFAULT NULL,
  `enterprise_healthpermits` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `processid` (`processid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table cosmetic_list
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_list`;

CREATE TABLE `cosmetic_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `processid` varchar(255) NOT NULL DEFAULT '',
  `productName` varchar(255) NOT NULL DEFAULT '',
  `enterpriseName` varchar(255) NOT NULL DEFAULT '',
  `is_off` smallint(2) NOT NULL,
  `provinceConfirm` date NOT NULL,
  `applySn` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `processid` (`processid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table cosmetic_pflist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_pflist`;

CREATE TABLE `cosmetic_pflist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `processid` char(100) NOT NULL DEFAULT '',
  `cname` char(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqkey` (`processid`,`cname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
