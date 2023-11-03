-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: coffee-management
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_by` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `modified_by` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Trà sữa','1','1',20001031231706,20001031231706,1),(2,'Cà phê','1','1',20001031231706,20001031231706,1),(3,'Sinh tố','1','1',20001031231706,20001031231706,1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo`
--

DROP TABLE IF EXISTS `combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `price` decimal(18,3) DEFAULT NULL,
  `discount_percentage` decimal(18,3) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `modified_by` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo`
--

LOCK TABLES `combo` WRITE;
/*!40000 ALTER TABLE `combo` DISABLE KEYS */;
INSERT INTO `combo` VALUES (3,'Combo trà sữa 1',NULL,80000.000,NULL,1,1,NULL,NULL,1687013430799,0,NULL),(4,'Combo coffee 2',NULL,120000.000,NULL,1,2,NULL,NULL,1687013529771,0,NULL),(5,'Com bo3',NULL,10000000.000,NULL,1,3,NULL,NULL,1688479951011,0,NULL);
/*!40000 ALTER TABLE `combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_item`
--

DROP TABLE IF EXISTS `combo_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `combo_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `modified_by` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_item`
--

LOCK TABLES `combo_item` WRITE;
/*!40000 ALTER TABLE `combo_item` DISABLE KEYS */;
INSERT INTO `combo_item` VALUES (6,3,1,19,NULL,0,NULL,1687013430966,23,1),(7,3,1,17,NULL,0,NULL,1687013431002,17,1),(8,4,1,20,NULL,0,NULL,1687013529810,27,1),(9,4,1,17,NULL,0,NULL,1687013529827,18,1),(10,4,1,19,NULL,0,NULL,1687013529842,23,1),(11,5,1,22,NULL,0,NULL,1688479951025,29,1),(12,5,1,21,NULL,0,NULL,1688479951032,28,1);
/*!40000 ALTER TABLE `combo_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dob` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `modified_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `phone_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `sex` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'anh Định',20001031231706,1,20221031231706,1685370544964,'1','1','0971223764','female','customer'),(2,'anh Tân',19921031231706,1,20221031231706,20221031231706,'1','1','0971223736','male','customer'),(3,'A tình',1688490000000,1,1688480879491,0,'admin','admin','0368648976','female','customer'),(4,'tung',0,1,1689576560447,0,'admin','admin','113',NULL,'partner');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `path` varchar(45) DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,'planet9_Wallpaper_5000x2813.jpg','planet9_Wallpaper_5000x2813.jpg',NULL,5865416,'image/jpeg');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `quantity` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `stock_unit_id` int DEFAULT NULL,
  `export_price` decimal(10,0) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (1,'Bột cà phê',975,1,1,120000,'1','1',1685285245498,1686415874180),(2,'Bột trà sữa',1928,1,1,20000,'1','1',1685285479431,1686415874147),(3,'Đường',1907,1,1,10000,'1','1',1685285510637,1686415874180),(4,'Sữa tươi',19979,1,3,10000,NULL,NULL,1686932064254,1686932064254),(5,'Bột trà',10003,1,3,10000,NULL,NULL,1686932090009,1686932090009),(6,'Trà sữa 1',1000,1,2,10000,NULL,NULL,1688479749308,1688479749308);
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_log`
--

DROP TABLE IF EXISTS `inventory_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `amount_charge_in_unit` varchar(50) DEFAULT NULL,
  `stock_remain` int DEFAULT NULL,
  `object_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_log`
--

LOCK TABLES `inventory_log` WRITE;
/*!40000 ALTER TABLE `inventory_log` DISABLE KEYS */;
INSERT INTO `inventory_log` VALUES (1,'NK95832','import',1,NULL,NULL,1687970773858,0,NULL,'+1',10003,11,5),(2,'Don6','order',1,NULL,NULL,1688010822961,0,'test báo cáo kho 3','+2',981,14,1),(3,'Don7','order',1,NULL,NULL,1688010966707,0,'test báo cáo kho 3','+1',1946,15,3),(4,'Don7','order',1,NULL,NULL,1688011147125,0,'test báo cáo kho 3','+1',1946,15,3),(5,'Don7','order',1,NULL,NULL,1688011445926,0,'test báo cáo kho 3','+1',1946,15,3),(6,'Don6','order',1,NULL,NULL,1688011491906,0,'test báo cáo kho 3','+2',977,14,1),(7,'Don6','order',1,NULL,NULL,1688011540582,0,'test báo cáo kho 3','+2',977,14,1),(8,'Don5','order',1,NULL,NULL,1688011818567,0,'test báo cáo kho 2 ','+2',19988,13,4),(9,'Don5','order',1,NULL,NULL,1688011818827,0,'test báo cáo kho 2 ','+2',977,13,1),(10,'Don5','order',1,NULL,NULL,1688011819188,0,'test báo cáo kho 2 ','+2',1956,13,2),(11,'Don5','order',1,NULL,NULL,1688011819373,0,'test báo cáo kho 2 ','+3',1946,13,3),(12,'Don5','order',1,NULL,NULL,1688011819788,0,'test báo cáo kho 2 ','+2',1946,13,3),(13,'Don5','order',1,NULL,NULL,1688011819962,0,'test báo cáo kho 2 ','+2',1956,13,2),(14,'DON17','order',1,NULL,NULL,1688480072160,0,NULL,'-10',1907,17,3),(15,'DON17','order',1,NULL,NULL,1688480072166,0,NULL,'-10',19978,17,4),(16,'DON17','order',1,NULL,NULL,1688480072171,0,NULL,'-24',1928,17,2),(17,'DON17','order',1,NULL,NULL,1688480072173,0,NULL,'-24',1907,17,3),(18,'DON9','order',2,NULL,NULL,1688480168783,0,'test báo cáo nhập kho 5','+2',1928,16,2),(19,'DON9','order',2,NULL,NULL,1688480168786,0,'test báo cáo nhập kho 5','+2',1907,16,3),(20,'DON9','order',2,NULL,NULL,1688480168790,0,'test báo cáo nhập kho 5','+1',1907,16,3),(21,'DON9','order',2,NULL,NULL,1688480168793,0,'test báo cáo nhập kho 5','+2',975,16,1),(22,'DON9','order',2,NULL,NULL,1688480168796,0,'test báo cáo nhập kho 5','+2',1907,16,3),(23,'DON9','order',2,NULL,NULL,1688480168801,0,'test báo cáo nhập kho 5','+2',1928,16,2),(24,'DON9','order',2,NULL,NULL,1688480168805,0,'test báo cáo nhập kho 5','+2',1928,16,2),(25,'DON9','order',2,NULL,NULL,1688480168808,0,'test báo cáo nhập kho 5','+2',1907,16,3),(26,'XK31324','export',1,NULL,NULL,1688480326879,0,NULL,'-10',990,13,6),(27,'XK31324','export',2,NULL,NULL,1688480331331,0,NULL,'+10',1000,13,13),(28,'NK54987','import',1,NULL,NULL,1689576773507,0,NULL,'+1',19979,15,4);
/*!40000 ALTER TABLE `inventory_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `image_url` text,
  `description` varchar(150) DEFAULT NULL,
  `discount_percentage` decimal(18,3) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `stock_unit_id` int DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (17,'Trà sữa trân châu',NULL,'Trà sữa',NULL,1,1,1,NULL,NULL,1686931768369,1686931768369),(18,'Cà phê đá',NULL,'Cà phê',NULL,1,2,1,NULL,NULL,1686931878177,1686931878177),(19,'Sữa tươi trân châu',NULL,'Sữa tươi trân châu đường đen',NULL,1,1,1,NULL,NULL,1686931975405,1686931975405),(20,'Cà phê sữa',NULL,'Cà phê sữa',NULL,1,1,1,NULL,NULL,1686932150080,1686932150080),(21,'trà sữa bò',NULL,NULL,NULL,1,1,1,NULL,NULL,1688057491127,1688057491129),(22,'trà sữa 1 ',NULL,NULL,NULL,1,3,1,NULL,NULL,1688057680096,1688057680096),(23,'Trà sữa oke',NULL,NULL,NULL,1,3,1,NULL,NULL,1688479903555,0);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_ingredient`
--

DROP TABLE IF EXISTS `item_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_ingredient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `amount_consume` int DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  `stock_unit_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_ingredient`
--

LOCK TABLES `item_ingredient` WRITE;
/*!40000 ALTER TABLE `item_ingredient` DISABLE KEYS */;
INSERT INTO `item_ingredient` VALUES (13,17,2,1686931768420,NULL,1686931768420,NULL,2,17,0,1),(14,17,3,1686931768436,NULL,1686931768436,NULL,2,17,0,1),(15,17,2,1686931768438,NULL,1686931768438,NULL,2,18,0,1),(16,17,3,1686931768438,NULL,1686931768438,NULL,3,18,0,1),(17,17,3,1686931768438,NULL,1686931768438,NULL,1,19,0,1),(18,17,2,1686931768438,NULL,1686931768438,NULL,1,19,0,1),(19,18,3,1686931878177,NULL,1686931878177,NULL,1,20,0,1),(20,18,1,1686931878177,NULL,1686931878177,NULL,2,20,0,1),(21,18,1,1686931878177,NULL,1686931878177,NULL,2,21,0,1),(22,18,3,1686931878192,NULL,1686931878192,NULL,1,21,0,1),(23,18,3,1686931878193,NULL,1686931878193,NULL,1,22,0,1),(24,18,1,1686931878193,NULL,1686931878193,NULL,1,22,0,1),(25,19,3,1686931975405,NULL,1686931975405,NULL,2,23,0,1),(26,19,2,1686931975405,NULL,1686931975405,NULL,2,23,0,1),(27,19,3,1686931975405,NULL,1686931975405,NULL,2,24,0,1),(28,19,2,1686931975405,NULL,1686931975405,NULL,3,24,0,1),(29,19,3,1686931975420,NULL,1686931975420,NULL,1,25,0,1),(30,19,2,1686931975420,NULL,1686931975420,NULL,1,25,0,1),(31,20,4,1686932150080,NULL,1686932150080,NULL,1,26,0,1),(32,20,1,1686932150080,NULL,1686932150080,NULL,1,26,0,1),(33,20,4,1686932150097,NULL,1686932150097,NULL,2,27,0,1),(34,20,1,1686932150097,NULL,1686932150097,NULL,2,27,0,1),(35,21,4,1688057491199,NULL,1688057491199,NULL,1,28,0,1),(36,22,3,1688057680103,NULL,1688057680103,NULL,1,29,0,1),(37,23,6,1688479903567,NULL,1688479903567,NULL,1,30,0,1);
/*!40000 ALTER TABLE `item_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `combo` tinyint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `price` decimal(18,3) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (10,8,3,1,1,80000.000,1,'Combo trà sữa 1','1','1',1687013756711,1687013756711),(11,8,4,1,1,120000.000,1,'Combo coffee 2','1','1',1687013761772,1687013761772),(12,10,4,1,1,120000.000,1,'Combo coffee 2','admin','admin',1688007316463,1688007316463),(13,10,17,0,1,50000.000,1,'Trà sữa trân châu - Trà sữa trân châu - M','admin','admin',1688007316490,1688007316491),(14,11,3,1,1,80000.000,6,'Combo trà sữa 1','admin','admin',1688009762006,1688009762006),(15,11,18,0,1,60000.000,1,'Trà sữa trân châu - Trà sữa trân châu - L','admin','admin',1688009762039,1688009762039),(16,12,3,1,1,80000.000,2,'Combo trà sữa 1','admin','admin',1688009955287,1688009955287),(17,12,17,0,1,50000.000,1,'Trà sữa trân châu - Trà sữa trân châu - M','admin','admin',1688009955317,1688009955318),(18,13,4,1,1,120000.000,1,'Combo coffee 2','admin','admin',1688010038994,1688010038994),(19,14,4,1,1,120000.000,2,'Combo coffee 2','admin','admin',1688010801284,1688010801284),(20,14,20,0,1,30000.000,1,'Cà phê đá - Cà phê đá - M','admin','admin',1688010801314,1688010801314),(21,15,4,1,1,120000.000,1,'Combo coffee 2','admin','admin',1688010960870,1688010960870),(22,15,21,0,1,40000.000,1,'Cà phê đá - Cà phê đá - L','admin','admin',1688010960887,1688010960887),(23,16,17,0,1,50000.000,1,'Trà sữa trân châu - Trà sữa trân châu - M','admin','admin',1688012033724,1688012033724),(24,16,20,0,1,30000.000,1,'Cà phê đá - Cà phê đá - M','admin','admin',1688012033734,1688012033734),(25,16,3,1,1,80000.000,1,'Combo trà sữa 1','admin','admin',1688012033747,1688012033747),(26,17,5,1,1,10000000.000,10,'Com bo3','admin','admin',1688480032676,1688480032676),(27,17,17,0,1,50000.000,12,'Trà sữa trân châu - Trà sữa trân châu - M','admin','admin',1688480032694,1688480032694);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item_combo`
--

DROP TABLE IF EXISTS `order_item_combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item_combo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(18,3) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `modified_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `order_item_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `combo_item_id` int DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item_combo`
--

LOCK TABLES `order_item_combo` WRITE;
/*!40000 ALTER TABLE `order_item_combo` DISABLE KEYS */;
INSERT INTO `order_item_combo` VALUES (6,'Sữa tươi trân châu - M',1,40000.000,1687013761750,1687013761750,'1','1',10,8,1,6,23),(7,'Trà sữa trân châu - M',1,50000.000,1687013761759,1687013761760,'1','1',10,8,1,7,17),(8,'Cà phê sữa - L',1,40000.000,1687013761782,1687013761782,'1','1',11,8,1,8,27),(9,'Trà sữa trân châu - L',1,60000.000,1687013761784,1687013761784,'1','1',11,8,1,9,18),(10,'Sữa tươi trân châu - M',1,40000.000,1687013761785,1687013761785,'1','1',11,8,1,10,23),(11,'Cà phê sữa - L',1,40000.000,1688007316477,1688007316477,'admin','admin',12,10,1,8,27),(12,'Trà sữa trân châu - L',1,60000.000,1688007316482,1688007316482,'admin','admin',12,10,1,9,18),(13,'Sữa tươi trân châu - M',1,40000.000,1688007316483,1688007316483,'admin','admin',12,10,1,10,23),(14,'Sữa tươi trân châu - M',6,40000.000,1688009762027,1688009762027,'admin','admin',14,11,1,6,23),(15,'Trà sữa trân châu - M',6,50000.000,1688009762031,1688009762031,'admin','admin',14,11,1,7,17),(16,'Sữa tươi trân châu - M',2,40000.000,1688009955306,1688009955306,'admin','admin',16,12,1,6,23),(17,'Trà sữa trân châu - M',2,50000.000,1688009955311,1688009955311,'admin','admin',16,12,1,7,17),(18,'Cà phê sữa - L',1,40000.000,1688010039003,1688010039003,'admin','admin',18,13,1,8,27),(19,'Trà sữa trân châu - L',1,60000.000,1688010039004,1688010039004,'admin','admin',18,13,1,9,18),(20,'Sữa tươi trân châu - M',1,40000.000,1688010039005,1688010039005,'admin','admin',18,13,1,10,23),(21,'Cà phê sữa - L',2,40000.000,1688010801303,1688010801303,'admin','admin',19,14,1,8,27),(22,'Trà sữa trân châu - L',2,60000.000,1688010801306,1688010801306,'admin','admin',19,14,1,9,18),(23,'Sữa tươi trân châu - M',2,40000.000,1688010801307,1688010801307,'admin','admin',19,14,1,10,23),(24,'Cà phê sữa - L',1,40000.000,1688010960879,1688010960879,'admin','admin',21,15,1,8,27),(25,'Trà sữa trân châu - L',1,60000.000,1688010960881,1688010960881,'admin','admin',21,15,1,9,18),(26,'Sữa tươi trân châu - M',1,40000.000,1688010960882,1688010960882,'admin','admin',21,15,1,10,23),(27,'Sữa tươi trân châu - M',1,40000.000,1688012033754,1688012033754,'admin','admin',25,16,1,6,23),(28,'Trà sữa trân châu - M',1,50000.000,1688012033758,1688012033758,'admin','admin',25,16,1,7,17),(29,'trà sữa 1  - m',10,11110.000,1688480032688,1688480032688,'admin','admin',26,17,1,11,29),(30,'trà sữa bò - size m',10,1000000.000,1688480032691,1688480032691,'admin','admin',26,17,1,12,28);
/*!40000 ALTER TABLE `order_item_combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `total` decimal(18,3) DEFAULT NULL,
  `discount_total` decimal(18,3) DEFAULT NULL,
  `note` varchar(150) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `payment_status` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (8,2,0,3,200000.000,0.000,'Đơn hàng nhận tại quầy',1687013756678,'1',1687789702875,'1','DON1',1),(10,1,0,5,170000.000,0.000,NULL,1688007316451,'admin',1688009655899,'admin','DON2',1),(11,2,0,5,540000.000,0.000,NULL,1688009761961,'admin',1688009817212,'admin','DON4',1),(12,1,0,5,210000.000,0.000,'test báo cáo kho 1',1688009955244,'admin',1688009968090,'admin','Don5',1),(13,2,0,3,120000.000,0.000,'test báo cáo kho 2 ',1688010038982,'admin',1688011922286,'admin','Don5',1),(14,2,0,3,270000.000,0.000,'test báo cáo kho 3',1688010801243,'admin',1688011540572,'admin','Don6',1),(15,2,0,3,160000.000,0.000,'test báo cáo kho 3',1688010960858,'admin',1688011445818,'admin','Don7',1),(16,2,0,4,160000.000,0.000,'test báo cáo nhập kho 5',1688012033707,'admin',1688480168776,'admin','DON9',1),(17,2,0,3,100600000.000,0.000,NULL,1688480032666,'admin',1688480158453,'admin','DON17',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `scopes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,1685260524,1685260524,1,1,'active','Quản lý','ADMIN','full'),(3,1685260524,1685260524,NULL,NULL,NULL,'nhân viên phục vụ','R26391',NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift`
--

DROP TABLE IF EXISTS `shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` int DEFAULT NULL,
  `shift_turnover` decimal(10,0) DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_croatian_ci DEFAULT NULL,
  `modified_by` varchar(50) COLLATE utf8mb4_croatian_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift`
--

LOCK TABLES `shift` WRITE;
/*!40000 ALTER TABLE `shift` DISABLE KEYS */;
/*!40000 ALTER TABLE `shift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_unit`
--

DROP TABLE IF EXISTS `stock_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_unit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_unit`
--

LOCK TABLES `stock_unit` WRITE;
/*!40000 ALTER TABLE `stock_unit` DISABLE KEYS */;
INSERT INTO `stock_unit` VALUES (1,'Túi',1,'1','1',1684834814730,1684834814730),(2,'Cái',1,'1','1',1684834814730,1684834814730),(3,'Gram',1,'1','1',1684834814730,1684834814730);
/*!40000 ALTER TABLE `stock_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocktaking_ingredient`
--

DROP TABLE IF EXISTS `stocktaking_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocktaking_ingredient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_by` varchar(45) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `ingredient_money` decimal(19,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `stocktaking_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocktaking_ingredient`
--

LOCK TABLES `stocktaking_ingredient` WRITE;
/*!40000 ALTER TABLE `stocktaking_ingredient` DISABLE KEYS */;
INSERT INTO `stocktaking_ingredient` VALUES (1,NULL,1686577901448,NULL,1686900360238,3,1000.00,3,2,1),(2,NULL,1686642930671,NULL,0,2,1000.00,1,2,2),(3,NULL,1686645623597,NULL,0,2,1000.00,6,2,3),(7,NULL,1687964897848,NULL,0,5,1000.00,1,1,7),(8,NULL,1687970771694,NULL,0,5,1000.00,1,1,11),(9,NULL,1688480241952,NULL,1688480260928,5,1000.00,144,1,12),(10,NULL,1688480326877,NULL,0,6,10000.00,10,2,13),(11,NULL,1689086831567,NULL,1689086841862,5,1000.00,1,1,14),(12,NULL,1689576773488,NULL,0,4,1000.00,1,1,15),(13,NULL,1689577129576,NULL,1689578178189,3,1000.00,1,1,16);
/*!40000 ALTER TABLE `stocktaking_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocktakings`
--

DROP TABLE IF EXISTS `stocktakings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocktakings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `total_money` decimal(18,3) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `payment` int DEFAULT NULL,
  `partner` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocktakings`
--

LOCK TABLES `stocktakings` WRITE;
/*!40000 ALTER TABLE `stocktakings` DISABLE KEYS */;
INSERT INTO `stocktakings` VALUES (1,'NK80568','phiếu 1 ','import',NULL,3000.000,3,'admin','admin',1686901726621,1686577901414,1,'test'),(2,'NK88719','phiếu 2','import','testt',1000.000,3,'admin','admin',1686797583228,1686642930570,1,'test'),(3,'NK74168','nhập 3 ','import','sadasdasdasdsa',6000.000,3,'admin','admin',1686797112345,1686645623584,2,'test'),(7,'XK43546','test trừ bột trà 1 ','export',NULL,1000.000,2,'admin','admin',1687964897818,1687964897818,1,'test'),(8,'NK39481','test dữ liệu 1 ','import',NULL,1000.000,2,'admin',NULL,1687964897818,1687970329445,1,'test'),(9,'NK48365','test dữ liệu 2','import',NULL,1000.000,2,'admin','admin',1687964897818,1687970523513,1,'test'),(10,'NK26180','test dữ liệu 3','import',NULL,1000.000,2,'admin','admin',1687964897818,1687970686958,1,'test'),(11,'NK95832','test dữ liệu chuẩn 1 ','import',NULL,1000.000,2,'admin','admin',1687964897818,1687970771654,1,'test'),(12,'NK76647','phiếu nhập 4','import',NULL,144000.000,2,'admin','admin',1688480260926,1688480241940,1,'test'),(14,'NK56101','test phiếu ','import',NULL,1000.000,1,'admin','admin',1689086841850,1689086831521,1,'A tình'),(15,'NK54987','test nhập tên','import',NULL,1000.000,2,'admin','admin',1687964897818,1689576773471,1,'tung'),(16,'NK83858','test thời gian ','import',NULL,1000.000,2,'admin','admin',1689578178177,1689577129532,2,'A tình');
/*!40000 ALTER TABLE `stocktakings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `table_order`
--

DROP TABLE IF EXISTS `table_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `table_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_croatian_ci DEFAULT NULL,
  `modified_by` varchar(50) COLLATE utf8mb4_croatian_ci DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `table_order`
--

LOCK TABLES `table_order` WRITE;
/*!40000 ALTER TABLE `table_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `table_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `status` int DEFAULT NULL,
  `created_by` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `modified_by` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_on` bigint DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `dob` bigint DEFAULT NULL,
  `phone_number` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1684834814730,1,1,1684834814730,'1','Admin',1684834814730,'099999999','$2a$10$Khpyjxl2HBtc5tUo5SrD..OHcdtfTak.V5CzBP/tJUe8bkhtTiulO','admin','admin@gmail.com'),(3,1684834814730,NULL,NULL,0,'1','tung',1684834814730,'0368638976','$2a$10$67EJHljcpv2NC55JSytPx.3amaaTcANWp8qIasyagNQUUElg4JLqm','tungnb','tung123@gmai.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_idx` (`user_id`),
  KEY `fk_role_idx` (`role_id`),
  CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1,1),(3,3,3);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant`
--

DROP TABLE IF EXISTS `variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `status` int DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `created_on` bigint DEFAULT NULL,
  `modified_on` bigint DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant`
--

LOCK TABLES `variant` WRITE;
/*!40000 ALTER TABLE `variant` DISABLE KEYS */;
INSERT INTO `variant` VALUES (17,'Trà sữa trân châu - M',1,NULL,NULL,50000,1686931768420,1686931768420,17),(18,'Trà sữa trân châu - L',1,NULL,NULL,60000,1686931768438,1686931768438,17),(19,'Trà sữa trân châu - S',1,NULL,NULL,45000,1686931768438,1686931768438,17),(20,'Cà phê đá - M',1,NULL,NULL,30000,1686931878177,1686931878177,18),(21,'Cà phê đá - L',1,NULL,NULL,40000,1686931878177,1686931878177,18),(22,'Cà phê đá - S',1,NULL,NULL,25000,1686931878193,1686931878193,18),(23,'Sữa tươi trân châu - M',1,NULL,NULL,40000,1686931975405,1686931975405,19),(24,'Sữa tươi trân châu - L',1,NULL,NULL,45000,1686931975405,1686931975405,19),(25,'Sữa tươi trân châu - S',1,NULL,NULL,50000,1686931975405,1686931975405,19),(26,'Cà phê sữa - M',1,NULL,NULL,30000,1686932150080,1686932150080,20),(27,'Cà phê sữa - L',1,NULL,NULL,40000,1686932150096,1686932150096,20),(28,'trà sữa bò - size m',1,NULL,NULL,1000000,1688057491188,1688057491188,21),(29,'trà sữa 1  - m',1,NULL,NULL,11110,1688057680100,1688057680100,22),(30,'Trà sữa oke - Size M',1,NULL,NULL,10000,1688479903561,1688479903561,23);
/*!40000 ALTER TABLE `variant` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-03 20:35:03
