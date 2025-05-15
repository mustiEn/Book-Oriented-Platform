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

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`content`,`type`,`is_read`,`createdAt`,`updatedAt`,`receiverId`,`is_hidden`) values 
(2,'{\"status\": \"deleted\", \"end_date\": 1777397997}','premium',1,'2025-04-27 16:09:04','2025-04-27 16:09:04',6,1),
(3,'{\"text\": \"fk ur mother\", \"postId\": 114}','post',1,'2025-04-27 17:00:21','2025-04-27 17:00:21',6,0),
(5,'{\"id\": 116, \"senderId\": \"4\"}','comment',1,'2025-04-28 14:33:52','2025-04-28 14:33:52',6,0),
(6,'{\"id\": 117, \"senderId\": 7, \"createdAt\": \"2025-04-28T16:13:51.392Z\"}','comment',1,'2025-04-28 17:13:51','2025-04-28 17:13:51',6,0),
(7,'{\"status\": \"created\", \"end_date\": 1748453729}','premium',1,'2025-04-28 18:35:32','2025-04-28 18:35:32',7,1),
(44,'{}','book_recommendation',0,'2025-05-02 14:23:00','2025-05-02 14:23:00',1,0),
(45,'{}','book_recommendation',0,'2025-05-02 14:23:01','2025-05-02 14:23:01',9,0),
(46,'{}','book_recommendation',1,'2025-05-02 16:07:00','2025-05-02 16:07:00',6,0),
(47,'{\"status\": \"created\", \"end_date\": 1777749816}','premium',1,'2025-05-02 20:23:40','2025-05-02 20:23:40',6,1),
(48,'{\"status\": \"deleted\", \"end_date\": 1777749816}','premium',1,'2025-05-02 20:31:04','2025-05-02 20:31:04',6,1),
(49,'{\"status\": \"created\", \"end_date\": 1777750449}','premium',1,'2025-05-02 20:34:12','2025-05-02 20:34:12',6,1),
(50,'{\"status\": \"created\", \"end_date\": 1748893276}','premium',1,'2025-05-02 20:41:19','2025-05-02 20:41:19',3,0),
(51,'{\"status\": \"deleted\", \"end_date\": 1746214905}','premium',1,'2025-05-02 20:41:46','2025-05-02 20:41:46',3,0),
(52,'{\"status\": \"created\", \"end_date\": 1748894646}','premium',1,'2025-05-02 21:04:09','2025-05-02 21:04:09',3,0),
(53,'{\"status\": \"deleted\", \"end_date\": 1746216269}','premium',1,'2025-05-02 21:04:29','2025-05-02 21:04:29',3,0),
(54,'{\"status\": \"deleted\", \"end_date\": 1746213465}','premium',1,'2025-05-02 21:16:51','2025-05-02 21:16:51',7,1),
(55,'{\"status\": \"created\", \"end_date\": 1748895714}','premium',1,'2025-05-02 21:21:57','2025-05-02 21:21:57',4,0),
(56,'{\"status\": \"deleted\", \"end_date\": 1746221692}','premium',1,'2025-05-02 22:34:53','2025-05-02 22:34:53',6,1),
(57,'{\"status\": \"created\", \"end_date\": 1748904020}','premium',1,'2025-05-02 23:40:23','2025-05-02 23:40:23',6,1),
(58,'{\"status\": \"created\", \"end_date\": 1777767094}','premium',1,'2025-05-03 01:11:37','2025-05-03 01:11:37',6,1),
(59,'{\"status\": \"created\", \"end_date\": 1777807195}','premium',1,'2025-05-03 12:19:59','2025-05-03 12:19:59',6,1),
(60,'{\"status\": \"created\", \"end_date\": 1777808732}','premium',1,'2025-05-03 12:45:36','2025-05-03 12:45:36',6,0),
(61,'{\"status\": \"created\", \"end_date\": 1777833088}','premium',1,'2025-05-03 19:31:32','2025-05-03 19:31:32',6,0),
(62,'{\"topic\": \"Literature\", \"postId\": 118, \"postType\": \"thought\"}','topic_post',1,'2025-05-04 17:18:53','2025-05-04 17:18:53',4,0),
(64,'{\"topic\": \"Literature\", \"postId\": 119, \"postType\": \"thought\"}','topic_post',1,'2025-05-04 17:29:01','2025-05-04 17:29:01',4,0),
(65,'{\"topic\": \"Literature\", \"postId\": 119, \"postType\": \"thought\"}','topic_post',1,'2025-05-04 17:29:01','2025-05-04 17:29:01',6,0),
(66,'{\"topic\": \"Literature\", \"postId\": 120, \"postType\": \"thought\"}','topic_post',0,'2025-05-04 18:55:55','2025-05-04 18:55:55',4,0),
(67,'{\"topic\": \"Literature\", \"postId\": 120, \"postType\": \"thought\"}','topic_post',1,'2025-05-04 18:55:55','2025-05-04 18:55:55',6,0),
(68,'{\"topic\": \"Literature\", \"postId\": 121, \"postType\": \"thought\"}','topic_post',0,'2025-05-04 19:45:11','2025-05-04 19:45:11',4,0),
(69,'{\"topic\": \"Literature\", \"postId\": 121, \"postType\": \"thought\"}','topic_post',1,'2025-05-04 19:45:11','2025-05-04 19:45:11',6,0),
(70,'{\"id\": 122, \"senderId\": 6}','comment',0,'2025-05-10 13:57:36','2025-05-10 13:57:36',49,0),
(71,'{\"id\": 123, \"senderId\": 6}','comment',0,'2025-05-10 14:04:00','2025-05-10 14:04:00',49,0),
(72,'{\"id\": 124, \"senderId\": 6}','comment',0,'2025-05-10 14:06:48','2025-05-10 14:06:48',49,0),
(73,NULL,'book_recommendation',0,'2025-05-11 13:12:00','2025-05-11 13:12:00',1,0),
(74,NULL,'book_recommendation',0,'2025-05-11 13:12:01','2025-05-11 13:12:01',9,0),
(75,NULL,'book_recommendation',0,'2025-05-11 13:15:00','2025-05-11 13:15:00',1,0),
(76,NULL,'book_recommendation',0,'2025-05-11 13:15:01','2025-05-11 13:15:01',9,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
