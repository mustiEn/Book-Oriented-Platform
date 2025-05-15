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

/*Data for the table `reviews` */

insert  into `reviews`(`id`,`title`,`review`,`createdAt`,`updatedAt`,`userId`,`bookId`,`topicId`) values 
(1,'rty','hey','2024-11-05 12:19:52','2024-11-05 12:19:52',6,52,1),
(2,'fdg','444','2024-11-05 12:19:52','2024-11-05 12:19:52',4,52,NULL),
(3,'ds','oh god','2024-11-05 12:19:52','2024-11-05 12:19:52',3,52,NULL),
(4,'fgf','fgfg','2024-11-17 15:38:52','2024-11-17 15:38:52',9,52,NULL),
(5,'hey','I love it','2024-11-07 12:19:52','2024-11-05 12:19:52',6,100,3),
(6,'rty','dang its so good','2024-11-05 12:19:52','2024-11-05 12:19:52',6,100,NULL),
(7,'rty','not too bad','2024-11-05 12:19:52','2024-11-05 12:19:52',6,101,NULL),
(8,'naiceuu','fgdg','2024-11-05 12:19:52','2024-11-05 12:19:52',5,101,NULL),
(10,'my title','so so','2024-11-23 13:49:35','2024-11-23 13:49:35',6,52,NULL),
(11,'my title','waited for so long','2024-11-23 13:50:33','2024-11-23 13:50:33',6,52,NULL),
(12,'deneme','meh','2024-11-23 13:58:21','2024-11-23 13:58:21',6,52,NULL),
(17,'deneem 3','its aight','2024-11-23 14:33:16','2024-11-23 14:33:16',6,52,NULL),
(18,'Global Branding Assistant','J','2024-11-27 00:00:00','2024-11-27 00:00:00',10,111,NULL),
(19,'Future Brand Executive','&','2024-11-27 00:00:00','2024-11-27 00:00:00',11,110,NULL),
(20,'National Solutions Officer','r','2024-11-27 00:00:00','2024-11-27 00:00:00',12,110,NULL),
(21,'Principal Communications Associate','i','2024-11-27 00:00:00','2024-11-27 00:00:00',13,110,NULL),
(22,'Regional Assurance Consultant','T','2024-11-27 00:00:00','2024-11-27 00:00:00',14,111,NULL),
(23,'Dynamic Communications Strategist','R','2024-11-27 00:00:00','2024-11-27 00:00:00',15,111,NULL),
(24,'Internal Brand Executive','o','2024-11-27 00:00:00','2024-11-27 00:00:00',16,111,NULL),
(25,'Direct Program Specialist','O','2024-11-27 00:00:00','2024-11-27 00:00:00',17,111,NULL),
(26,'Chief Data Associate','5','2024-11-27 00:00:00','2024-11-27 00:00:00',18,110,NULL),
(27,'Lead Implementation Technician','3','2024-11-27 00:00:00','2024-11-27 00:00:00',19,110,NULL),
(28,'Product Optimization Analyst','T','2024-11-27 00:00:00','2024-11-27 00:00:00',20,110,NULL),
(29,'Regional Identity Assistant','&','2024-11-27 00:00:00','2024-11-27 00:00:00',21,111,NULL),
(30,'Senior Directives Strategist','l','2024-11-27 00:00:00','2024-11-27 00:00:00',22,111,NULL),
(31,'Human Metrics Representative','e','2024-11-27 00:00:00','2024-11-27 00:00:00',23,111,NULL),
(32,'Forward Communications Consultant','u','2024-11-27 00:00:00','2024-11-27 00:00:00',24,111,NULL),
(33,'Human Program Designer','d','2024-11-27 00:00:00','2024-11-27 00:00:00',25,111,NULL),
(34,'Forward Intranet Engineer','2','2024-11-27 00:00:00','2024-11-27 00:00:00',26,111,NULL),
(35,'Senior Configuration Liaison','n','2024-11-27 00:00:00','2024-11-27 00:00:00',27,111,NULL),
(36,'Corporate Accountability Associate','W','2024-11-27 00:00:00','2024-11-27 00:00:00',28,111,NULL),
(37,'Senior Usability Strategist','5','2024-11-27 00:00:00','2024-11-27 00:00:00',29,111,NULL),
(38,'International Markets Agent','G','2024-11-27 00:00:00','2024-11-27 00:00:00',30,110,NULL),
(39,'Principal Tactics Agent','G','2024-11-27 00:00:00','2024-11-27 00:00:00',31,111,NULL),
(40,'Regional Division Analyst','H','2024-11-27 00:00:00','2024-11-27 00:00:00',32,111,NULL),
(41,'National Configuration Officer','$','2024-11-27 00:00:00','2024-11-27 00:00:00',33,110,NULL),
(42,'Customer Factors Associate','h','2024-11-27 00:00:00','2024-11-27 00:00:00',34,110,NULL),
(43,'Principal Infrastructure Specialist','d','2024-11-27 00:00:00','2024-11-27 00:00:00',35,110,NULL),
(44,'Chief Directives Administrator','T','2024-11-27 00:00:00','2024-11-27 00:00:00',36,111,NULL),
(45,'Central Research Analyst','3','2024-11-27 00:00:00','2024-11-27 00:00:00',37,111,NULL),
(46,'Future Applications Liaison','I','2024-11-27 00:00:00','2024-11-27 00:00:00',38,110,NULL),
(47,'Forward Quality Assistant','P','2024-11-27 00:00:00','2024-11-27 00:00:00',39,111,NULL),
(48,'Senior Tactics Manager','l','2024-11-27 00:00:00','2024-11-27 00:00:00',40,110,NULL),
(49,'Investor Branding Agent','b','2024-11-27 00:00:00','2024-11-27 00:00:00',41,111,NULL),
(50,'Internal Group Consultant','9','2024-11-27 00:00:00','2024-11-27 00:00:00',42,110,NULL),
(51,'Dynamic Security Strategist','W','2024-11-27 00:00:00','2024-11-27 00:00:00',43,110,NULL),
(52,'Global Applications Manager','6','2024-11-27 00:00:00','2024-11-27 00:00:00',44,110,NULL),
(53,'Human Solutions Analyst','6','2024-11-27 00:00:00','2024-11-27 00:00:00',45,111,NULL),
(54,'Forward Directives Supervisor','p','2024-11-27 00:00:00','2024-11-27 00:00:00',46,110,NULL),
(55,'Dynamic Quality Architect','q','2024-11-27 00:00:00','2024-11-27 00:00:00',47,111,NULL),
(56,'International Metrics Administrator','V','2024-11-27 00:00:00','2024-11-27 00:00:00',48,111,NULL),
(57,'Principal Security Supervisor','b','2025-04-18 19:32:27','2024-11-27 00:00:00',49,110,NULL),
(60,'hey','very nice','2025-04-18 19:32:30','2025-04-18 15:44:16',6,2,1),
(61,'www','meaba','2025-04-18 19:32:32','2025-04-18 16:10:47',6,2,1),
(62,'12','second','2025-04-18 19:32:35','2025-04-18 16:12:15',6,2,2),
(63,'tt','123','2025-04-18 19:32:37','2025-04-18 16:16:09',6,2,1),
(64,'rt','ttt','2025-04-18 19:32:40','2025-04-18 16:18:47',6,2,1),
(65,'11','00','2025-04-18 19:32:45','2025-04-18 16:20:45',6,2,1),
(66,'we','ttt','2025-04-18 19:32:43','2025-04-18 16:39:10',6,1,1),
(67,'t','tt','2025-04-18 17:47:06','2025-04-18 17:47:10',6,NULL,NULL),
(68,'12345','iiiiiiiiiii','2025-04-18 19:32:51','2025-04-18 16:48:34',6,1,1),
(69,'mmm','mmm','2025-04-18 19:49:53','2025-04-18 18:32:30',6,1,1),
(70,'hey','fffff','2025-04-22 00:17:47','2025-04-22 00:17:47',6,1,8),
(71,'den','amazing','2025-04-22 12:16:10','2025-04-22 12:16:10',6,1,5),
(72,'my new title','excellent','2025-04-23 19:07:12','2025-04-23 19:07:12',6,1,5),
(73,'12234','not bad','2025-04-23 19:49:05','2025-04-23 19:49:05',6,1,8),
(74,'111','cant be better','2025-04-23 19:51:28','2025-04-23 19:51:28',6,4,17),
(75,'111','dddsds','2025-04-24 22:39:16','2025-04-24 22:39:16',6,1,NULL),
(76,'y','hh','2025-04-24 22:44:03','2025-04-24 22:44:03',6,6,24);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
