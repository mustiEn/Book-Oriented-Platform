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

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`firstname`,`lastname`,`email`,`password`,`DOB`,`gender`,`profile_photo`,`background_photo`,`createdAt`,`updatedAt`) values 
(1,'benaki','ali','mm','test@gmail.com','$2b$10$m20/CKPqDs3czKGLSra7yuz/fs/QxJIM.kHQ1lsr8Yjei22C2IHli','2000-09-06','Male',NULL,NULL,'2024-09-24 13:04:58','2024-09-24 13:04:58'),
(3,'levi','tyty','sd','tes23t@gmail.com','$2b$10$m20/CKPqDs3czKGLSra7yuz/fs/QxJIM.kHQ1lsr8Yjei22C2IHli','2004-09-06','Male',NULL,NULL,'2024-09-24 13:04:58','2024-09-24 13:04:58'),
(4,'435ttt','ben67','dd','we@test.com','$2b$10$QgCtJjOOXbuTrXnkI3/05O/wZ74o9Bk3rCpBFnRaSxgDFqYR57MfG','2000-10-18','Male',NULL,NULL,'2024-10-28 10:30:21','2024-10-28 10:30:21'),
(5,'12merv_w','merve','abc','wee@test.com','$2b$10$K0FrYYaB7T4gmPyQjkwPuu7Rj2dVcptA7v4gDw5z86ixVMOK2pKea','1996-11-14','Female',NULL,NULL,'2024-11-04 14:49:25','2024-11-04 14:49:25'),
(6,'ben11w','ben','mack','wede@test.com','$2b$10$n7ysa2EMLljOsSFfSxjyBu.rBd1ofB5iWODNQUjXCPlGN5fXYFxle','1980-11-07','Male','6_pp_2025_03_28_170871539_Capture.PNG','6_bg_2025_03_28_190586250_Screenshott.png','2024-11-04 15:00:59','2025-03-28 20:14:48'),
(7,'ii6g','t','tt','wedee@test.com','$2b$10$n7ysa2EMLljOsSFfSxjyBu.rBd1ofB5iWODNQUjXCPlGN5fXYFxle','1980-11-07','Male','7_pp_2025_05_09_734958693_Screenshott.png',NULL,'2024-11-04 15:00:59','2025-05-09 01:27:02'),
(8,'fg','ff','ff','uu@qq.co','$2b$10$XvLQI0wN4.2gXYGFjKsJnOrWiODvDlkGbaFCKVc1Xj9g7BGyjaWaq','2024-11-09','Female',NULL,NULL,'2024-11-16 16:17:12','2024-11-16 16:17:12'),
(9,'asddddd','1234','sadas','asd@asl.com','$2b$10$nakXd8ejWFtXwmQHbtEJXOPCWoiGtM89BYFDlGcujugD62ieoClvq','2024-11-08','Male',NULL,NULL,'2024-11-17 15:37:40','2024-11-17 15:37:40'),
(10,'Luis.Kovacek','Betsy','Weber-Medhurst','Emie.Gleason84@example.com','4efebea179de163495cc3b7471b50953c639b1f099160ba7fbd4709181776a79','2025-01-29','Male',NULL,NULL,'2025-01-29 00:00:00','2024-12-29 00:00:00'),
(11,'Caitlyn_Kreiger24','Verna','Bauch','Ebony_Boehm77@example.org','aedb07b041154fe4dab9110da216288e3b7c299bbddba7281871ce70fc84bee0','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(12,'Dexter.Kuhlman14','Janie','Fahey','Chaz_Hand-Runte@example.net','ac5fbf5ccc086ec4d2d8f81f0bd2a359d8c10b14f89d5610bbaede3cd72ee0f6','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(13,'Magnolia50','Miguel','Jacobi','Donna_Schamberger@example.org','24c43596501d7ff018b7e9264aca586d4957b646074ff30ffaa6c5f7256c498b','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(14,'Rosie_Fay','Ross','Morar','Eleazar.Pfannerstill@example.net','91b68535e91ab77b6337a6d9284fb99cda3ed6d2e69955db08e9c8849e9fb3d1','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(15,'Jessy7','Josefina','Schmidt','Jett_Schinner21@example.net','43ff608e6ad385866188406a6e31e9fcba61b99910de38a858997b9495bdc0ba','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(16,'Horacio_Bashirian81','Salvador','Ratke','Urban32@example.com','ad534a0ae725314532973e0b53fcb27da8274ee5f76ee3a61517936979785135','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(17,'Roslyn_Glover','Curtis','Wiegand','Ashtyn.Turcotte@example.org','efedf4764f04e5ed092f730e3f749aa611bd79d6987806fe0804406aa484d5ca','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(18,'Devon_Waters15','Heather','Von','Brycen6@example.org','6bb42549558c25ca3f2cfa901df45f425510911435999a0ded6701f6953f22c4','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(19,'Wayne80','Rodolfo','Wolf','Jovanny.Ritchie10@example.com','44a73facfbd5ca027b43af31a411763955f577884bcdf44ff531c25193f990cf','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(20,'Jovani.Torphy','Robert','Kshlerin','Wyman_Schultz@example.net','4468412890da8c3ae3ed8bd1734765c12982d513b7358813e1868a9b807e0b32','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(21,'Trisha_Stokes','Sam','Jast','Austin_Rodriguez29@example.net','f801939572806b0a4e8a0cec3e5abd801afa6243e08899cfa96890be41bfc3b8','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(22,'Delbert_Weimann26','Rosemarie','Willms','Vincent73@example.org','946d932640cb70567abb4037ac72220532f89024e0ada7fdcb046ced640c4b26','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(23,'Elisha_Waelchi','Cecilia','Yundt','Aric.Daugherty22@example.com','4ed68e6cf973aaacc713d7a2f5b67a4b70aa7c82877c9c29446c7673a396921d','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(24,'Savanah94','Ray','Dooley','Nicola29@example.net','35ca4d5a2a7d3e334fa6734e929531150a7f9fb19d51b25157901ba349769f87','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(25,'Kendall_Bauch','Clifford','Haag','Brendan96@example.net','65058011140d72339cfec044d14387cbfa00133c25dc3130f2c42e88ac511ecb','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(26,'Jordi.Jacobs65','Mario','Jacobi','Armando.Tremblay65@example.com','37f9fc8e2ac442a071ea6147a496eeae597ac549e645b66d4664f6b6b06c4f4b','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(27,'Chasity_Kulas','Simon','Schinner','Lacy83@example.net','733e3e2c4b5e3d5498770bc2f9bd4b19f3efc2ccfa72913b70bed011204a71d8','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(28,'Gayle.Upton','Desiree','Baumbach-Emard','Stan75@example.net','4ecd7f5b54f646aae56d6f34f6855ecf9f6e49ab972fdc57a378d2c78d492217','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(29,'Juvenal_Larson','Nelson','Roberts','Kasandra_Skiles@example.net','47d45f9992d05b937a1f121c404f5f10146cd35e33e8194f597e5221d3b58c1d','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(30,'Catalina78','Hannah','Lakin','Alexie_Stehr@example.com','79972cd846498710223512133931f7ac81a9fd588b968198108c5a18ea9d911f','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(31,'Lisa.Marks57','Bradford','Connelly','Sabrina_Dietrich23@example.org','3dbde6c5d256d3b68648575881fd1c5a0fd979a83cb49e598abe3f1cc85a0eb3','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(32,'Nicolas37','Cora','Kuphal','Chanel_Mosciski@example.com','4cf91247b7ebdc7d7aec9c08f1418f50740c36b42d53629db09fa1305d42034e','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(33,'Abigayle3','Brandi','Zboncak','Alta_Willms@example.net','547e42c28657646c0f96af04f6d906084ad6c1dc8eeb83cdb796aefaa7d4c9ea','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(34,'Kristopher.Roob','Suzanne','Lind','Aaliyah39@example.com','23f4b54311d3381ccf4481bdd7e1e8b8a1b6ae3a79556d1bc6299f0114f33e64','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(35,'Verner.McDermott','Gretchen','Turcotte','Carolina27@example.net','6f71b3275c55e0a2f2cbc3b6a998d9883ba9ffa8ef7bfdd1b92a713bd8a556ca','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(36,'Nikko48','Nick','Leuschke','Alison.Waters66@example.com','b48019ba25f6f3eedd6609172a166d400c4d1a1c0d4db3f3c0e14c7a779c389e','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(37,'Shanelle.Kovacek99','Tracy','Carroll','Forest22@example.org','523d46ebd45dc0efcf7236a01b66528de309f564e3da5b23a035c2ab38340933','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(38,'Litzy_Rolfson7','Jack','Hoeger','Orin_Lynch@example.org','9df097fe92830007b1f1c230df9e7a9c1f691249b9c720853b4a502ea2ac52a7','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(39,'Zoila_Schamberger8','Felipe','Shanahan-Herzog','Elouise77@example.org','6ef14c71752197f841970b6dbf475f6ec3314b843b82d03b223756b5038bd261','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(40,'Ruby_Weimann73','Woodrow','Torp','Sigrid14@example.com','d1cb8eac5ca1520c91a4febcd9a021c9c6a339f76a86ecb100c5c7a5e42be51c','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(41,'Guy.Lind','Ethel','Stoltenberg','Eulalia.Cremin52@example.net','84b33fd9895f7983b7ba4172ae34c8919b57f85ad75bd4cdf69916371d8f5861','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(42,'Cierra.Funk7','Dustin','Kuhlman','Kade50@example.com','829cb3beb1f99f2f32570adb09c5d591137ba3c8ba422ea810ca9421c0f68e05','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(43,'Omer.Jacobi','Lillian','Cartwright','Dallin_Davis68@example.net','968c2bd615183f46ac825f55b89d2452e731d934296aae65d3cf624b033b0b07','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(44,'Eldora.Koelpin','Terri','Emmerich','Sedrick_Langworth69@example.org','47390d2ff7ebf9a9940aa4a7789570e96371255acc43d69f86435a6fa9594daa','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(45,'Elizabeth_Upton79','Martin','Braun','Felix70@example.com','e7c4d3a6bb1c7a4988b5e33190978a6084fba4157555e702c7833c988259c146','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(46,'Jannie80','Wesley','Kohler','Monserrat.Mertz63@example.net','69d23a608b6cda87849f0094a2b30e370e50c7c89395efee54ecae267d1ed0a1','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(47,'Laisha_Jacobs','Monique','Bashirian','River_Mills@example.com','a2696ed975bec3422aa5fc06949d8d2cff893b714d443c95fdbef14e950fa742','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(48,'Ward45','Tonya','Corwin','Max_Kunde@example.org','7a0cf2d2cd05b824952002691c9ff5523ba2eb513e421f3a9f8270871c03fefa','2024-11-27','Female',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(49,'Terence.Watsica96','Ian','Mohr','Lea_Hirthe3@example.net','f0ea6e8de9eb25578b37803b867cf4dec1347b8c784aac720c18bac88304f5d6','2024-11-27','Male',NULL,NULL,'2024-11-27 00:00:00','2024-11-27 00:00:00'),
(51,'111mike','mike','james','test11@gmail.com','$2b$10$uqcvRW7kDmYkvt.Mesn7ve9os156em9WDeB9iK3wjl.RU1rxWkSha','2000-02-12','Male',NULL,NULL,'2025-03-13 16:50:01','2025-03-13 16:50:01'),
(58,'fgddt','ee','rrr','leeel@gmail.com','$2b$10$Ml74j0KTjMs8cLt/nwR28uR/p1SOaQ2zkKKSmhUIc6h/xOOD1E5p6','2025-03-07','Male',NULL,NULL,'2025-03-22 17:31:05','2025-03-22 17:31:05'),
(59,'fakeUsername','fakeFirstname','fakeLastname','fakeEmail@gmail.com','$2b$10$VQHVQlDOsV7e9VIdBTGv2OUo7CjNJ1ONlScfJVIvq0haGSGHsEQe.','1990-01-01','Male',NULL,NULL,'2025-03-22 17:44:33','2025-03-22 17:44:33'),
(60,'sdfsdf','ben11w','sdfsdf','tes3t@gmail.com','$2b$10$cXQEYdLAbb65PODV.f8IlOm4fkxxJiPVXkjnKVtDPbWKaSYB3mbte','2025-05-08','Male',NULL,NULL,'2025-05-11 17:51:12','2025-05-11 17:51:12'),
(61,'sdfsdfs','ben11w5','sdfsdf','tes4t@gmail.com','$2b$10$zAPjh/pmyJ0uCOAmJKXeQ.cFBiFNCaUnza.P375RtX6AXgZyj20Ru','2025-05-08','Male',NULL,NULL,'2025-05-11 17:55:48','2025-05-11 17:55:48');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
