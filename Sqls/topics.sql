/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 8.0.40 : Database - book-app
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`book-app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `book-app`;

/*Data for the table `topics` */

insert  into `topics`(`id`,`topic`,`image`,`post_count`,`follower_count`) values 
(1,'Literature','Literature.jpg',13,2),
(2,'History','History.webp',1,0),
(3,'Philosophy','Philosophy.jpg',0,0),
(4,'Wild Rift','Wild_rift.jpg',0,0),
(5,'Brawl Stars','Brawl_stars.jpg',2,0),
(6,'Literature and Novel','Kuhn',0,0),
(7,'#RafahOnFire','Morar',0,0),
(8,'Artificial Intelligence','Welch',2,0),
(9,'Instagram','Walter',0,0),
(10,'Gemini','Connelly-Davis',0,0),
(11,'ChatGBT','Parker',0,0),
(12,'Software','Bartell',0,0),
(13,'Personal Development','Rutherford',0,0),
(14,'Education','Mills',0,0),
(15,'Child Development','Larson',0,0),
(16,'Psychology','Halvorson',0,0),
(17,'Istanbul','Krajcik',1,0),
(18,'London','Grant',0,0),
(19,'Berlin','Hodkiewicz',0,0),
(20,'Paris','Abernathy',0,0),
(21,'Politics','Politics.webp',0,0),
(22,'de','#000',0,0),
(23,'dedfdf','#000',0,0),
(24,'#deneme2','#000',1,0),
(25,'#denem9','#095109',1,0),
(26,'tt','#095109',0,0),
(30,'22','#710c0c',0,0),
(31,'3','#710c0c',0,0),
(32,'Yemek','#095109',0,0),
(34,'hey','#000',0,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
