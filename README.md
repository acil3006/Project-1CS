# Aethera Healthcare Module Prototype (EduSihha)

High-fidelity prototype for the **Aethera Student Welfare Platform** healthcare module.

## Run

```bash
npm install
npm run dev
```

## Interfaces included

1. **Al-Talib (Student mobile UI)**
   - Login with BAC credentials
   - Module cards (Accommodation, Healthcare, Activities)
   - Healthcare tabs: booking, tracking, teleconsultation, documents, prescriptions, campaigns

2. **EduSihha (Medical web platform)**
   - Shared platform for **Doctor** and **Nurse**
   - Role-based navigation and permissions
   - Nurse restrictions shown with disabled actions requiring doctor authorization

3. **EduPlan (DOU/ONOU admin dashboard)**
   - Scope-aware admin access
   - KPI supervision, escalated issues, compliance/security panel, audit logs

## Mock credentials

### Student
- BAC registration number: `12345678`
- Secret password: `BAC2026`

### Medical staff
- Doctor: `DOC-1001` / `doctor123` (Role: Doctor)
- Nurse: `NUR-2001` / `nurse123` (Role: Nurse)

### Admin
- Regional DOU: `DOU-ALGIERS` / `admin123` (Scope: DOU)
- National ONOU: `ONOU-NATIONAL` / `admin123` (Scope: ONOU)

## Guided scenario walkthrough

Use the **“Run guided scenario (steps 3-10)”** button on the login page to simulate:

1. Student appointment request (`Pending validation`)
2. Nurse validation + triage
3. Doctor consultation finalization (`Seasonal flu suspicion`)
4. Prescription issuance (`Paracetamol 500mg`)
5. Nurse dispensing + stock reduction
6. Admin-visible KPI and audit-log updates
7. Publication of **Seasonal Flu Prevention Campaign**

You can reset all mock state with **“Reset demo state”**.
