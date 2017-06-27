# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.18-log)
# Database: v2_okoer5
# Generation Time: 2017-06-27 09:52:03 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table cosmetic_list
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_list`;

CREATE TABLE `cosmetic_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `processid` varchar(255) NOT NULL DEFAULT '',
  `productName` varchar(255) NOT NULL DEFAULT '',
  `brand` varchar(255) NOT NULL DEFAULT '',
  `enterprise_name` varchar(255) NOT NULL DEFAULT '',
  `enterprise_address` varchar(255) NOT NULL DEFAULT '',
  `real_enterprise_name` varchar(255) NOT NULL DEFAULT '',
  `real_enterprise_address` varchar(255) NOT NULL DEFAULT '',
  `apply_date` date NOT NULL,
  `apply_sn` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `parent_id` varchar(255) NOT NULL,
  `org_name` varchar(255) NOT NULL DEFAULT '',
  `org_code` varchar(255) NOT NULL DEFAULT '',
  `launch_date` date NOT NULL,
  `is_entrust` char(5) NOT NULL DEFAULT '',
  `is_auto_product` char(5) NOT NULL DEFAULT '',
  `sid` varchar(255) NOT NULL DEFAULT '',
  `flow_name` varchar(255) NOT NULL DEFAULT '',
  `enterprise_sn` char(100) NOT NULL DEFAULT '',
  `displayname` varchar(255) NOT NULL DEFAULT '',
  `applytype` char(5) NOT NULL DEFAULT '',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `processid` (`processid`),
  UNIQUE KEY `uniq_productName` (`productName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table cosmetic_pflist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cosmetic_pflist`;

CREATE TABLE `cosmetic_pflist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `processid` varchar(255) NOT NULL DEFAULT '',
  `cname` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `processid` (`processid`),
  CONSTRAINT `fk_processid` FOREIGN KEY (`processid`) REFERENCES `cosmetic_list` (`processid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
