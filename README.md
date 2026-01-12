 ## Odontirx – AI-Enabled Mini Electronic Dental Record (Mini-EDR)

An AI-driven Electronic Dental Record (EDR) system integrating clinical dental workflows, relational databases, and machine-learning–based oral cancer risk prediction.
Designed to demonstrate real-world healthcare informatics, clinical data modeling, and decision-support systems.

 Internship Project | Health Informatics & Bioinformatics
 Focus: EDR Systems • Clinical Data Analytics • AI in Dentistry

 ## Project Highlights 
 Full-stack Electronic Dental Record (EDR) system
 Oral Cancer Risk Prediction using ML models
 Structured clinical data schema (patients, appointments, treatments)
 Realistic healthcare workflows (appointments → encounters → diagnosis)
 Designed with scalability, analytics, and AI-readiness in mind

 ## Core Features
🧑‍⚕️ Patient Management
Secure patient registration with demographic & medical history
Unique patient ID tracking
Searchable patient profiles

📅 Appointment Scheduling
Create, update, and manage dental appointments
Dentist-specific scheduling
Prevents duplicate booking conflicts

🦷 Clinical Encounter & Treatment Records
Tooth-level findings and diagnosis documentation
Treatment planning and completion tracking
Supports longitudinal patient care records

🧠 AI-Based Oral Cancer Risk Prediction
Machine Learning models trained on clinical & lifestyle features
Predicts Low / Moderate / High oral cancer risk
Designed for clinical decision support, not diagnosis

📊 Dashboard & Analytics
Total patients, appointments, treatments
Dentist-wise appointment analytics
Upcoming appointments monitoring

## Technology Stack
Layer	    Technology
Frontend	  React.js
Backend	   Node.js, Express.js
Database	  MySQL
ML / AI	   Python (Scikit-Learn, Random Forest, XGBoost –experimentation)
Analytics	 SQL, REST APIs
Tools	     GitHub, DBeaver, VS Code

## Project Structure
Odontirx-MiniEDR/
│
├── mini-edr-frontend/        # React frontend
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── mini-edr-backend/         # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── db.js
│   └── server.js
│
├── ML-Oral-Cancer-Prediction/
│   ├── notebooks/
│   ├── models/
│   ├── train.py
│   └── requirements.txt
│
├── database/
│   └── schema.sql            # MySQL database schema
│
└── README.md

## Machine Learning Module
Input Features
Age
Gender
Tobacco / smoking history
Alcohol consumption
Oral lesions
Family history

{
  "risk_level": "High"
}

## Database Design (Clinical-Grade)
Patients
Dentists
Appointments
Encounters
Tooth Findings
Treatments
Designed using normalized relational modeling aligned with real dental workflows.

## Why This Project Matters
This project demonstrates:
Real-world healthcare data modeling
EDR / EHR-style system thinking
Integration of AI with clinical workflows
Ability to bridge clinical knowledge + technical skills

## Author
## Sarika Vemana
🎓 MS Health Informatics & Bioinformatics
🦷 Former Dentist | Healthcare Data & AI Enthusiast
🔗 LinkedIn: linkedin.com/in/sarika-vemana

