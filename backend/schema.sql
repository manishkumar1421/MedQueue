-- ================================================================
-- MedQueue Database Schema
-- MySQL 8.0 | Run this file in MySQL Workbench to setup the DB
-- ================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS medqueue_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medqueue_db;

-- ================================================================
-- TABLES
-- ================================================================

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
  id          VARCHAR(20)   PRIMARY KEY,
  code        VARCHAR(5)    NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  description TEXT,
  head        VARCHAR(100),
  room        VARCHAR(50),
  status      ENUM('Active','Inactive') DEFAULT 'Active',
  assigned_doctors INT DEFAULT 0,
  queue_paused TINYINT(1) DEFAULT 0,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors
CREATE TABLE IF NOT EXISTS doctors (
  id              VARCHAR(20)   PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  UNIQUE NOT NULL,
  mobile          VARCHAR(20),
  department_id   VARCHAR(20),
  department_name VARCHAR(100),
  specialization  VARCHAR(150),
  room_number     VARCHAR(20),
  start_time      VARCHAR(20)   DEFAULT '09:00 AM',
  end_time        VARCHAR(20)   DEFAULT '05:00 PM',
  break_time      VARCHAR(50),
  max_patients    INT           DEFAULT 25,
  experience      VARCHAR(30),
  rating          DECIMAL(3,1)  DEFAULT 4.5,
  status          ENUM('Available','Busy','On Leave','Unavailable') DEFAULT 'Available',
  available_days  VARCHAR(200)  DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
  avatar          TEXT,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 4. Users / Patients (registered accounts)
CREATE TABLE IF NOT EXISTS users (
  id              VARCHAR(30)   PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  UNIQUE NOT NULL,
  mobile          VARCHAR(20)   UNIQUE NOT NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  role            ENUM('Patient','Doctor','Receptionist','Admin') DEFAULT 'Patient',
  gender          ENUM('Male','Female','Other') DEFAULT 'Male',
  dob             DATE,
  blood_group     VARCHAR(5),
  address         TEXT,
  status          ENUM('Active','Inactive') DEFAULT 'Active',
  total_visits    INT DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. OPD Queue
CREATE TABLE IF NOT EXISTS queue (
  id                VARCHAR(30)   PRIMARY KEY,
  token_number      VARCHAR(20)   NOT NULL,
  patient_id        VARCHAR(30),
  patient_name      VARCHAR(100)  NOT NULL,
  patient_age       INT,
  patient_gender    VARCHAR(10),
  patient_mobile    VARCHAR(20),
  doctor_id         VARCHAR(20),
  doctor_name       VARCHAR(100),
  department_id     VARCHAR(20),
  department_name   VARCHAR(100),
  room_number       VARCHAR(20),
  appointment_time  VARCHAR(20),
  status            ENUM('Waiting','Called','In Consultation','Completed','Skipped','On Hold','Cancelled') DEFAULT 'Waiting',
  priority          ENUM('Normal','Senior Citizen','Emergency') DEFAULT 'Normal',
  appointment_type  VARCHAR(50)   DEFAULT 'Online Appointment',
  reason_for_visit  TEXT,
  date              DATE,
  called_at         VARCHAR(20),
  consultation_started_at VARCHAR(20),
  completed_at      VARCHAR(20),
  cancel_reason     TEXT,
  created_at        DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id)  REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id              VARCHAR(30)   PRIMARY KEY,
  patient_id      VARCHAR(30),
  patient_name    VARCHAR(100)  NOT NULL,
  doctor_id       VARCHAR(20),
  doctor_name     VARCHAR(100),
  department_id   VARCHAR(20),
  department_name VARCHAR(100),
  token_number    VARCHAR(20),
  date            DATE,
  time            VARCHAR(20),
  room            VARCHAR(20),
  type            VARCHAR(50)   DEFAULT 'Online Appointment',
  status          ENUM('Waiting','Called','In Consultation','Completed','Cancelled') DEFAULT 'Waiting',
  reason          TEXT,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id)  REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 7. OPD Counters
CREATE TABLE IF NOT EXISTS counters (
  id              VARCHAR(20)   PRIMARY KEY,
  number          VARCHAR(30)   NOT NULL,
  name            VARCHAR(100),
  department_id   VARCHAR(20),
  department_name VARCHAR(100),
  assigned_staff  VARCHAR(100),
  status          ENUM('Active','Inactive') DEFAULT 'Active',
  queue_length    INT DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id          VARCHAR(30)   PRIMARY KEY,
  title       VARCHAR(200)  NOT NULL,
  message     TEXT,
  type        VARCHAR(50)   DEFAULT 'general',
  role        VARCHAR(30),
  target_user_id VARCHAR(30),
  is_read     TINYINT(1)    DEFAULT 0,
  time_label  VARCHAR(50)   DEFAULT 'Just now',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- 9. Hospital Settings
CREATE TABLE IF NOT EXISTS settings (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  hospital_name         VARCHAR(200)  DEFAULT 'MedQueue Central Hospital',
  opd_start_time        VARCHAR(20)   DEFAULT '09:00 AM',
  opd_end_time          VARCHAR(20)   DEFAULT '06:00 PM',
  avg_consultation_time INT           DEFAULT 10,
  max_tokens_per_day    INT           DEFAULT 40,
  auto_call_delay       INT           DEFAULT 0,
  sound_alert_enabled   TINYINT(1)    DEFAULT 1,
  sms_enabled           TINYINT(1)    DEFAULT 1,
  updated_at            DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default settings row
INSERT IGNORE INTO settings (id, hospital_name) VALUES (1, 'MedQueue Central Hospital');

-- ================================================================
-- DONE ✅
-- ================================================================
SELECT 'MedQueue database setup complete!' AS status;
