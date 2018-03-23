# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.21)
# Database: TR Database
# Generation Time: 2018-03-23 02:25:20 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table consumption
# ------------------------------------------------------------

DROP TABLE IF EXISTS `consumption`;

CREATE TABLE `consumption` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reimbursement` int(11) unsigned NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `occurTime` varchar(32) NOT NULL DEFAULT '',
  `description` text,
  `money` float DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `funding` int(11) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table reimbursement
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reimbursement`;

CREATE TABLE `reimbursement` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestion` int(11) unsigned NOT NULL,
  `occurTime` varchar(32) NOT NULL DEFAULT '',
  `changeTime` varchar(32) NOT NULL DEFAULT '',
  `laboratory` int(11) DEFAULT NULL,
  `destination` text,
  `allMoney` float NOT NULL,
  `approver` int(11) DEFAULT NULL,
  `fightTime` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table requestion
# ------------------------------------------------------------

DROP TABLE IF EXISTS `requestion`;

CREATE TABLE `requestion` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` int(11) unsigned NOT NULL,
  `project` int(11) DEFAULT NULL,
  `requester` varchar(11) NOT NULL DEFAULT '',
  `occurTime` varchar(32) NOT NULL DEFAULT '',
  `startTime` varchar(32) NOT NULL,
  `endTime` varchar(32) NOT NULL,
  `way` int(11) DEFAULT NULL,
  `destination` varchar(32) NOT NULL DEFAULT '',
  `description` text,
  `approver` text,
  `changeTime` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `requestion` WRITE;
/*!40000 ALTER TABLE `requestion` DISABLE KEYS */;

INSERT INTO `requestion` (`id`, `state`, `project`, `requester`, `occurTime`, `startTime`, `endTime`, `way`, `destination`, `description`, `approver`, `changeTime`)
VALUES
	(11,1,1,'1','1521770159859','1520438400000','1523808000000',30,'北京','参加国际重点虚拟化技术研讨会',NULL,NULL),
	(12,1,1,'1','1521770633102','1522425600000','1524585600000',32,'上海','国际虚拟化技术峰会',NULL,NULL),
	(13,1,1,'1','1521771306177','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(14,1,1,'1','1521771359019','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(15,1,1,'1','1521771378624','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(16,1,1,'1','1521771392076','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(17,1,1,'1','1521771593190','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(18,1,1,'1','1521771626488','1522339200000','1523980800000',32,'深圳','一校三区深圳专区虚拟技术会议',NULL,NULL),
	(19,1,1,'1','1521771693608','1522425600000','1523808000000',32,'哈尔滨','总部学习',NULL,NULL),
	(20,1,1,'1','1521771810567','1521820800000','1523894400000',30,'济南','项目招标',NULL,NULL);

/*!40000 ALTER TABLE `requestion` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(11) NOT NULL DEFAULT '',
  `phone` varchar(11) NOT NULL DEFAULT '',
  `Email` varchar(32) DEFAULT NULL,
  `level` int(1) NOT NULL DEFAULT '0',
  `pwd` varchar(32) NOT NULL DEFAULT '123456',
  `avatar` varchar(100) DEFAULT '/images/avators',
  `laboratory` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `name`, `phone`, `Email`, `level`, `pwd`, `avatar`, `laboratory`)
VALUES
	(1,'刘连兴','17862702878','17862702878@163.com',0,'123456','/images/avators','虚拟化技术研究室');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_pro
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_pro`;

CREATE TABLE `user_pro` (
  `uid` int(11) unsigned NOT NULL,
  `pid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`pid`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
