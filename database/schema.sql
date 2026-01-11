-- mini_edr.dentists definition

CREATE TABLE `dentists` (
  `dentist_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`dentist_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.patients definition

CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `government_id` varchar(15) DEFAULT NULL,
  `emergency_contact` varchar(50) DEFAULT NULL,
  `emergency_phone` varchar(50) DEFAULT NULL,
  `marital_status` enum('Single','Married','Other') DEFAULT NULL,
  `occupation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.appointments definition

CREATE TABLE `appointments` (
  `app_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `dentist_id` int NOT NULL,
  `app_date` date NOT NULL,
  `app_time` time NOT NULL,
  `visit` enum('New','Re-visit') DEFAULT NULL,
  `complaint` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`app_id`),
  KEY `fk_app_pt` (`patient_id`),
  KEY `idx_app_dentist_date` (`dentist_id`,`app_date`),
  CONSTRAINT `fk_app_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_app_pt` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.encounters definition

CREATE TABLE `encounters` (
  `encounter_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `dentist_id` int NOT NULL,
  `app_id` int DEFAULT NULL,
  `enc_visit` enum('New','Re-visit') DEFAULT NULL,
  `encounter_dt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `difficulty_swallowing` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `unexplained_bleeding` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `notes` text,
  PRIMARY KEY (`encounter_id`),
  KEY `fk_enc_app` (`app_id`),
  KEY `idx_enc_patient_dt` (`patient_id`,`encounter_dt`),
  KEY `idx_enc_dentist_dt` (`dentist_id`,`encounter_dt`),
  CONSTRAINT `fk_enc_app` FOREIGN KEY (`app_id`) REFERENCES `appointments` (`app_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_enc_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_enc_pt` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.labtests definition

CREATE TABLE `labtests` (
  `labtest_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `encounter_id` bigint DEFAULT NULL,
  `test_name` varchar(80) NOT NULL,
  `result_value` varchar(50) DEFAULT NULL,
  `units` varchar(20) DEFAULT NULL,
  `reference_range` varchar(40) DEFAULT NULL,
  `result_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`labtest_id`),
  KEY `patient_id` (`patient_id`),
  KEY `encounter_id` (`encounter_id`),
  CONSTRAINT `labtests_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `labtests_ibfk_2` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.past_history definition

CREATE TABLE `past_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `medical_history` text,
  `allergies` text,
  `dental_history` text,
  `tobacco_use` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `alcohol_use` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `betel_quid_use` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `diet_fruits_veggies` enum('Adequate','Inadequate','Unknown') DEFAULT 'Unknown',
  `hpv_infection` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `chronic_sun_exposure` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `family_history_cancer` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `compromised_immune_system` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `duration` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`history_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `past_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.radiographs definition

CREATE TABLE `radiographs` (
  `radiograph_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `dentist_id` int DEFAULT NULL,
  `encounter_id` bigint DEFAULT NULL,
  `x_rays` enum('Periapical','Bitewing','OPG','Occlusal','CBCT','Cephalometric') DEFAULT NULL,
  `tooth_code` varchar(4) DEFAULT NULL,
  `taken_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `radiographic_diagnosis` text,
  `image_data` longblob,
  `image_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`radiograph_id`),
  KEY `fk_rd_dentist` (`dentist_id`),
  KEY `fk_rd_encounter` (`encounter_id`),
  KEY `idx_rd_patient_enc` (`patient_id`,`encounter_id`),
  CONSTRAINT `fk_rd_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rd_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rd_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.toothfindings definition

CREATE TABLE `toothfindings` (
  `findings_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `encounter_id` bigint NOT NULL,
  `tooth_code` varchar(4) DEFAULT NULL,
  `tooth_condition` enum('caries','restoration','missing','crown','RCT','fracture','other') NOT NULL,
  `status` enum('active','treated','watch') DEFAULT 'active',
  `severity` enum('mild','moderate','severe') DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `oral_lesions` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `white_red_patches` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `poor_oral_hygiene` enum('Yes','No','Unknown') DEFAULT 'Unknown',
  `notes` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`findings_id`),
  KEY `encounter_id` (`encounter_id`),
  KEY `idx_patient_tooth` (`patient_id`,`tooth_code`),
  CONSTRAINT `toothfindings_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `toothfindings_ibfk_2` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.vitals definition

CREATE TABLE `vitals` (
  `vitals_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `encounter_id` bigint NOT NULL,
  `measured_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `systolic_mmHg` smallint DEFAULT NULL,
  `diastolic_mmHg` smallint DEFAULT NULL,
  `pulse_bpm` smallint DEFAULT NULL,
  `temp_c` decimal(4,1) DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,1) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`vitals_id`),
  KEY `encounter_id` (`encounter_id`),
  KEY `idx_vitals_patient_dt` (`patient_id`,`measured_at`),
  CONSTRAINT `vitals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `vitals_ibfk_2` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.diagnosis definition

CREATE TABLE `diagnosis` (
  `diagnosis_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `dentist_id` int DEFAULT NULL,
  `encounter_id` bigint DEFAULT NULL,
  `provisional_diagnosis` text,
  `final_diagnosis` text,
  PRIMARY KEY (`diagnosis_id`),
  KEY `fk_dx_patient` (`patient_id`),
  KEY `fk_dx_dentist` (`dentist_id`),
  KEY `fk_dx_encounter` (`encounter_id`),
  CONSTRAINT `fk_dx_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dx_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dx_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.treatment definition

CREATE TABLE `treatment` (
  `treatment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `dentist_id` int DEFAULT NULL,
  `encounter_id` bigint DEFAULT NULL,
  `diagnosis_id` int DEFAULT NULL,
  `tooth_code` varchar(4) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('planned','completed','cancelled') DEFAULT 'planned',
  `planned_date` date DEFAULT NULL,
  `performed_date` date DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`treatment_id`),
  KEY `fk_tx_patient` (`patient_id`),
  KEY `fk_tx_dentist` (`dentist_id`),
  KEY `fk_tx_encounter` (`encounter_id`),
  KEY `fk_tx_diagnosis` (`diagnosis_id`),
  CONSTRAINT `fk_tx_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_tx_diagnosis` FOREIGN KEY (`diagnosis_id`) REFERENCES `diagnosis` (`diagnosis_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tx_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tx_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mini_edr.prescription definition

CREATE TABLE `prescription` (
  `prescriotion_id` int NOT NULL AUTO_INCREMENT,
  `treatment_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `dentist_id` int NOT NULL,
  `encounter_id` bigint DEFAULT NULL,
  `drug_name` varchar(120) NOT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `duration_days` smallint DEFAULT NULL,
  `quantity` varchar(40) DEFAULT NULL,
  `instructions` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`prescriotion_id`),
  KEY `fk_rx_patient` (`patient_id`),
  KEY `fk_rx_dentist` (`dentist_id`),
  KEY `fk_rx_encounter` (`encounter_id`),
  KEY `fk_rx_treatment` (`treatment_id`),
  CONSTRAINT `fk_rx_dentist` FOREIGN KEY (`dentist_id`) REFERENCES `dentists` (`dentist_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rx_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `encounters` (`encounter_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_rx_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rx_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;