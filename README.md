# Aethera EduSihha Healthcare Prototype

High-fidelity interactive prototype for the Healthcare module of the Aethera Student Welfare Platform.

The prototype focuses on EduSihha while still showing the full modular platform context:

- Al-Talib mobile app for students
- EduSihha web platform for medical staff
- EduPlan dashboard for DOU/ONOU administrators
- Shared mock state that simulates the centralized Aethera API gateway

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Mock Credentials

| Interface | Credentials |
| --- | --- |
| Student - Al-Talib | BAC number `12345678`, password `BAC2026` |
| Doctor - EduSihha | Professional ID `DOC-1001`, password `doctor123` |
| Nurse - EduSihha | Professional ID `NUR-2001`, password `nurse123` |
| DOU admin - EduPlan | Admin ID `DOU-ALGIERS`, password `admin123`, scope `Regional DOU` |
| ONOU admin - EduPlan | Admin ID `ONOU-NATIONAL`, password `admin123`, scope `National ONOU` |

## Interfaces

### Al-Talib Mobile App

Mobile-first student interface. After authentication, the student sees the three Aethera modules:

- Accommodation
- Healthcare
- Activities

Only Healthcare is deeply prototyped. It includes appointment booking, status tracking, teleconsultation request, health documents, prescriptions, notifications, medical certificates, and prevention campaigns.

### EduSihha Medical Staff Platform

Shared web platform for healthcare professionals, with role-based interfaces:

- Doctor workspace: appointment calendar, patient records, consultations, diagnosis, prescriptions, referrals, teleconsultations, certificates, reports.
- Nurse workspace: appointment queue, walk-in registration, triage, document verification, prescription dispensing, stock visibility, patient orientation.

Restricted nurse actions are disabled and labelled with doctor authorization requirements.

### EduPlan Admin Dashboard

DOU/ONOU dashboard for supervision and piloting:

- Regional/national overview metrics
- Analytics and simple charts
- Prevention campaign publishing
- Staff and operations monitoring
- Drug stock and equipment alerts
- Compliance reporting
- Escalated issue management
- Security & Traceability panel for API gateway, RBAC, audit logs, and national hosting readiness

## Guided Demo Scenario

Use the visible "Guided demo flow" panel to track progress across roles.

1. Log in as the student and open Healthcare.
2. Book an on-site general consultation for fever and headache.
3. Log out, then log in as the nurse.
4. Open Appointment Queue and validate the request.
5. Open Triage and save the preset vital signs.
6. Log out, then log in as the doctor.
7. Open Consultations and finalize the diagnosis and prescription.
8. Log out, then log in as the nurse again.
9. Open Prescription Dispensing and mark the prescription as dispensed.
10. Log in as DOU or ONOU admin and review updated supervision metrics.
11. Open Prevention Campaigns and publish the Seasonal Flu Prevention Campaign.
12. Log back in as the student and open Prevention Campaigns to see the published campaign.

The scenario updates appointments, consultation status, prescription status, stock quantity, notifications, campaigns, metrics, and audit logs in local storage.

## Reset Demo State

Use the reset button in the Guided demo flow panel to restore the initial mock data.
