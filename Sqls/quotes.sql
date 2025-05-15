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

/*Data for the table `quotes` */

insert  into `quotes`(`id`,`title`,`quote`,`page`,`createdAt`,`updatedAt`,`userId`,`bookId`,`topicId`) values 
(1,'ee','dgdfg','34','2024-11-25 14:34:31','2024-11-25 14:34:33',6,2,NULL),
(2,'mytte','book quote','11','2025-04-25 15:39:21','2025-04-25 15:39:21',6,1,NULL),
(3,'mytte','hey','2','2025-04-25 15:40:23','2025-04-25 15:40:23',6,1,NULL),
(4,'mytte','merrgg','2','2025-04-25 15:42:35','2025-04-25 15:42:35',6,1,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
