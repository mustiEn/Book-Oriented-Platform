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

/*Data for the table `private_notes` */

insert  into `private_notes`(`id`,`private_note`,`createdAt`,`updatedAt`,`bookId`,`userId`) values 
(1,NULL,'2024-11-04 20:52:12','2024-11-04 20:52:12',2,6),
(2,'just added note my private','2024-11-04 21:45:49','2025-05-10 17:18:54',52,6),
(4,NULL,'2024-11-12 13:21:35','2024-11-12 13:21:35',7,6),
(5,NULL,'2024-11-12 13:21:35','2024-11-12 13:21:35',7,6),
(6,NULL,'2024-11-17 11:26:27','2024-11-17 11:26:27',4,6),
(7,NULL,'2024-11-17 15:37:48','2024-11-17 15:37:48',2,9),
(8,'xgxgfxgxg','2024-11-17 15:38:04','2024-11-17 15:38:04',52,9),
(9,NULL,'2024-11-17 15:39:21','2024-11-17 15:39:21',4,9),
(10,NULL,'2024-11-17 15:52:44','2024-11-17 15:52:44',1,9),
(11,'ttu','2024-11-18 12:53:38','2024-12-24 16:24:38',1,6),
(12,'terteTrp5drfr9y','2024-12-22 18:11:56','2024-12-24 01:31:50',100,6),
(13,NULL,'2025-05-05 14:35:15','2025-05-05 14:35:15',1,7),
(14,NULL,'2025-05-08 15:02:13','2025-05-08 15:02:13',3,7);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
