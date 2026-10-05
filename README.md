# MedQueue - Hospital Queue Management System

A modern, production-grade Outpatient Department (OPD) Queue Management System web application designed for multi-specialty hospitals and clinics.

---

## 🌟 Key Highlights & Design Philosophy

- **Light Theme Only**: Implemented with pure white surfaces, soft medical slate borders, and professional sky blue / teal accents (`#0284c7`, `#0d9488`).
- **Real-Time Queue Telemetry**: Live OPD queue monitor with animated currently serving tokens, dynamic patient wait time calculations (`Patients Ahead × Average Consultation Time`), and audio chime notifications.
- **Role-Based Architecture**: 4 specialized portals with role-based routing and a 1-click Demo Role Switcher at the top of every dashboard:
  1. **Patient Portal**
  2. **Receptionist Portal**
  3. **Doctor Portal**
  4. **Admin Panel**
- **5-Step Self-Service Appointment Booking**: Department selection → Specialist Doctor profiles & ratings → Date picker → Real-time Slot availability → Instant unique Token generation.
- **Professional Token Confirmation Pass**: Printable, downloadable hospital pass featuring barcode simulation, room allocation, and QR representation.
- **Priority Triage Engine**: Emergency cases (immediate priority), Senior Citizens (fast-tracked), and Normal OPD appointments.
- **Recharts Analytics & CSV Export**: Real-time KPI cards, daily patient volume trends, department workload breakdown, status distribution, and 1-click CSV report exports.

---

## 🏥 Clinical Demo Data Included

- **8 Clinical Departments**: Cardiology, General Medicine, Orthopedics, Dermatology, Pediatrics, ENT, Neurology, Dental Surgery.
- **8 Specialist Doctors**: Complete with photos, qualifications, experience, available days, and room numbers (Rooms 102, 108, 112, 118, 204, 207, 302, 402).
- **20+ Realistic Patients**: Demographics, blood groups, contact numbers, and medical visit histories.
- **35+ OPD Appointments & Active Queues**: Tokens C-018, C-019, C-020 (Emergency), C-025 (Demo Patient), G-031, O-014, etc.
- **4 OPD Counters**: Main Triage Desk, Cardiology Specialty, Orthopedics Desk, and 24/7 Acute Emergency Counter.

---

## 🔑 Quick Demo Credentials (1-Click Switcher Available in Topbar)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Patient** | Rahul Sharma | `rahul.sharma@example.com` | `password123` |
| **Receptionist** | Pooja Verma | `reception@medqueue.org` | `password123` |
| **Doctor** | Dr. Amit Sharma (Cardiology) | `amit.sharma@medqueue.org` | `password123` |
| **Admin** | Dr. Siddharth Kapoor (CMO) | `admin@medqueue.org` | `password123` |

*Tip: You can switch between all 4 roles instantly using the top banner pills!*

---

## 🚀 Running Locally

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (already installed)
npm install

# Start Vite Development Server
npm run dev

# The application is live at:
http://127.0.0.1:5173/
```

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS Design System (Custom properties, Light Theme, Responsive Grids, Clean Tables, Print Media Styles)
- **Icons**: Lucide React
- **Charts & Data Visualizations**: Recharts
- **Notifications**: React Hot Toast + Web Audio API Hospital Chime
- **Persistence**: Relational Mock Store with LocalStorage synchronization
