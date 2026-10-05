const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('./db');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  console.log('🌱 Seeding initial data into MySQL...');

  try {
    const defaultPasswordHash = await bcrypt.hash('password123', 12);

    // 1. Seed Departments
    const departments = [
      ['dept-1', 'CARD', 'Cardiology', 'Heart and cardiovascular system care', 'Dr. Amit Sharma', 'Room 204'],
      ['dept-2', 'ORTH', 'Orthopedics', 'Bones, joints, ligaments and tendons', 'Dr. Rajesh Iyer', 'Room 108'],
      ['dept-3', 'PEDI', 'Pediatrics', 'Medical care for infants, children, and adolescents', 'Dr. Priya Patel', 'Room 302'],
      ['dept-4', 'NEUR', 'Neurology', 'Disorders of the nervous system and brain', 'Dr. Sunita Rao', 'Room 215'],
      ['dept-5', 'DERM', 'Dermatology', 'Skin, hair, and nail health care', 'Dr. Vikram Malhotra', 'Room 112'],
      ['dept-6', 'GENM', 'General Medicine', 'Primary care and non-surgical health management', 'Dr. Anita Joshi', 'Room 101']
    ];

    for (const dept of departments) {
      await pool.query(
        `INSERT INTO departments (id, code, name, description, head, room, status)
         VALUES (?, ?, ?, ?, ?, ?, 'Active')
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
        dept
      );
    }
    console.log('✅ Departments seeded');

    // 2. Seed Users
    const users = [
      ['pat-demo-1', 'Rahul Sharma', 'rahul.sharma@example.com', '9876543210', defaultPasswordHash, 'Patient', 'Male'],
      ['doc-1', 'Dr. Amit Sharma', 'amit.sharma@medqueue.org', '9876511001', defaultPasswordHash, 'Doctor', 'Male'],
      ['rec-1', 'Pooja Verma', 'reception@medqueue.org', '9822334455', defaultPasswordHash, 'Receptionist', 'Female'],
      ['adm-1', 'Dr. Siddharth Kapoor', 'admin@medqueue.org', '9811009988', defaultPasswordHash, 'Admin', 'Male']
    ];

    for (const u of users) {
      await pool.query(
        `INSERT INTO users (id, name, email, mobile, password_hash, role, gender, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
         ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash)`,
        u
      );
    }
    console.log('✅ Users seeded (password: password123)');

    // 3. Seed Doctors
    const doctors = [
      ['doc-1', 'Dr. Amit Sharma', 'amit.sharma@medqueue.org', '9876511001', 'dept-1', 'Cardiology', 'Senior Interventional Cardiologist', '204', '09:00 AM', '05:00 PM', '16 Years', 4.9],
      ['doc-2', 'Dr. Priya Patel', 'priya.patel@medqueue.org', '9876511002', 'dept-3', 'Pediatrics', 'Consultant Pediatrician', '302', '10:00 AM', '04:00 PM', '10 Years', 4.8],
      ['doc-3', 'Dr. Rajesh Iyer', 'rajesh.iyer@medqueue.org', '9876511003', 'dept-2', 'Orthopedics', 'Chief Joint Replacement Surgeon', '108', '08:30 AM', '03:30 PM', '19 Years', 4.9],
      ['doc-4', 'Dr. Sunita Rao', 'sunita.rao@medqueue.org', '9876511004', 'dept-4', 'Neurology', 'Senior Neurologist & Stroke Specialist', '215', '11:00 AM', '06:00 PM', '14 Years', 4.7]
    ];

    for (const doc of doctors) {
      await pool.query(
        `INSERT INTO doctors (id, name, email, mobile, department_id, department_name, specialization, room_number, start_time, end_time, experience, rating, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')
         ON DUPLICATE KEY UPDATE specialization=VALUES(specialization), room_number=VALUES(room_number)`,
        doc
      );
    }
    console.log('✅ Doctors seeded');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
