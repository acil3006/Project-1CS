# Aethera Student Welfare Platform — Healthcare Module Prototype

High‑fidelity interactive prototype for the **EduSihha** healthcare module of the Aethera student welfare platform. The prototype includes:

- **Al‑Talib mobile app** (student interface)
- **EduSihha web platform** (doctor & nurse roles)
- **EduPlan dashboard** (DOU/ONOU administrators)

The accommodation and activities modules appear in the student app as preview cards, while the healthcare module is fully interactive.

## Run the prototype

```bash
npm install
npm run dev
```

## Mock credentials

### Student (Al‑Talib)
- Bac registration number: `12345678`
- Password: `BAC2026`

### Medical staff (EduSihha)
- Doctor: `DOC-1001` / `doctor123`
- Nurse: `NUR-2001` / `nurse123`

### Admin (EduPlan)
- DOU: `DOU-ALGIERS` / `admin123`
- ONOU: `ONOU-NATIONAL` / `admin123`

## Interface overview

### 1) Al‑Talib — Student mobile app
- Three modules after login (Accommodation, Healthcare, Activities)
- Healthcare flows: appointment booking, tracking, teleconsultation, documents, prescriptions, prevention campaigns
- Status badges, notifications, and student identity card

### 2) EduSihha — Medical staff web platform
- **Doctor** and **Nurse** share the same platform but see role‑specific navigation and actions
- Doctor: consultations, diagnosis, prescriptions, referrals, certificates, teleconsultations
- Nurse: appointment validation, triage, document verification, dispensing, stock visibility

### 3) EduPlan — DOU/ONOU admin dashboard
- Regional or national view based on scope
- Monitoring KPIs, campaigns, compliance, stock alerts, staffing gaps
- Security & traceability panel with audit log highlights

## Guided scenario walkthrough

1. **Student login** — log in to Al‑Talib with the student credentials.
2. **Select Healthcare** — open the healthcare module.
3. **Book appointment** — use the guided scenario button to request a general consultation.
4. **Nurse login** — validate the appointment and save triage notes.
5. **Doctor login** — finalize consultation, issue prescription.
6. **Nurse dispensing** — mark prescription as dispensed and update stock.
7. **Student follow‑up** — view completed appointment and dispensed prescription.
8. **Admin supervision** — see updated KPIs and audit logs.
9. **Prevention campaign** — publish the seasonal flu campaign and confirm it appears in student campaigns.

## Notes

- The prototype uses local storage to persist mock session data.
- No backend is required; all data is simulated in a local mock store.
