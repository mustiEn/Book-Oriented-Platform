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

/*Data for the table `topic_categories` */

insert  into `topic_categories`(`id`,`topic_category`) values 
(7,'Anime'),
(8,'Art'),
(9,'Business'),
(10,'Collections and Other Hobbies'),
(11,'Education and Career'),
(12,'Fashion and Beauty'),
(13,'Food and Beverages'),
(2,'Games'),
(23,'Health'),
(14,'Home and Garden'),
(22,'Horror'),
(15,'Humanities and Law'),
(1,'Literature'),
(6,'Movies and Television'),
(16,'Music'),
(17,'Nature and Outdoors'),
(18,'News and Politics'),
(19,'Places and Travel'),
(5,'Pop Culture'),
(3,'Questions and Answers'),
(24,'Religion'),
(20,'Science'),
(25,'Software'),
(21,'Sports'),
(4,'Technology');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
