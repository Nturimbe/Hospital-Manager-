# Backend/API QA Test Report

Tester: Nyognu Nturimbe Id: 11254227
System: Hospital Management System
Environment: Live deployment (Render + hosted SQL Server)
Base URL: https://hospital-manager-deploy.onrender.com/api
Branch/Commit tested: develop @ 07f9017
Date: 5 October 2026

## Automated Test Run (xUnit, prior pass)

| Project | Total | Passed | Failed | Skipped |
|---|---|---|---|---|
| HospitalManagement.API.Tests | 8 | 8 | 0 | 0 |

## Manual Test Cases — Executed

| ID | Area | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| API-01 | Authentication | Register valid patient | Account created, JWT returned | `200`, JWT returned with `role: "Patient"` | Pass |
| API-02 | Authentication | Register duplicate email | Request rejected | Body: "An account with this email already exists." (matches `Conflict()` in source — `AuthController.cs`) | Pass |
| API-03 | Authentication | Login valid credentials | JWT returned | `200`, JWT returned | Pass |
| API-04 | Authentication | Login wrong password | Request rejected | Body: "Invalid email or password." (matches `Unauthorized()` in source) | Pass |
| API-05 | Authorization | No token on protected endpoint (`GET /api/Patients`) | `401 Unauthorized` | `401` confirmed | Pass |
| API-06 | Authorization | Self-register with `"role": "Admin"` | Should be rejected or ignored for public self-registration | `200 OK` — valid signed JWT issued with `role: "Admin"` claim (decoded and confirmed). Reproduced twice with two separate accounts. | **Fail — Critical defect (DEFECT-001)** |
| API-07 | Patients | Create valid patient (authenticated) | `200`/`201` with patient record | `200`, patient created with `id: 4`, all submitted fields returned correctly | Pass |
| API-08 | Patients | Retrieve nonexistent patient (`id=999999`) | `404` | `404`, RFC 9110 Problem Details response | Pass |
| API-09 | Doctors (security) | `DELETE /api/Doctors/{id}` with **no Authorization header at all** | `401 Unauthorized` (endpoint should require auth) | `404 Not Found` — request was processed by the controller with no auth challenge; a protected endpoint would have returned `401` before the lookup ever ran. Confirms `DoctorsController.cs` has no `[Authorize]` on `PUT`/`DELETE` (only `POST` is protected). | **Fail — Critical defect (DEFECT-002)** |
| — | Doctors | `GET /api/Doctors` (no token) | `200`, public per deployment notes | `200`, returned real doctor records (id, license number, phone, department) | Pass (public by design) |
| — | Appointments | `GET /api/Appointments` with Patient token, no appointments yet | `200`, empty/own-only list | `200`, `[]` | Pass |
| — | Medical Records | `GET /api/medical-records` with Patient token, no records yet | `200`, empty/own-only list | `200`, `[]` | Pass |

## Manual Test Cases — Blocked (feature not implemented in deployed `develop` branch)

Confirmed by direct source review of `backend/HospitalManagement.API/Controllers/` at commit `07f9017`. Not a testing gap — these endpoints do not exist yet.

| ID | Area | Test | Why blocked |
|---|---|---|---|
| API-13 | Appointments | Update appointment status | `AppointmentsController` only implements `GET` (list) and `POST` (create). No status-update endpoint exists. |
| — | Appointments | Delete-protection when a medical record is linked | No `DELETE` endpoint exists on `AppointmentsController` at all. |
| API-14 | EMR | Create valid medical record | `MedicalRecordsController` only implements `GET` (list). No `POST` exists — there is currently no way to create a medical record through the API. |
| API-15 | EMR | Wrong appointment/patient link validation | Cannot be tested — depends on the `POST` endpoint above, which doesn't exist. |
| API-16 | EMR | Retrieve patient's medical history by patient ID | No `GET /api/medical-records/patient/{id}` route exists — only a flat `GET /api/medical-records` (self-scoped for Patients) is implemented. |
| API-11 | Appointments | Reject appointment with a past date | No date validation exists in `AppointmentsController.Create` — confirmed by source review, not live-tested. Any date, past or future, is accepted as submitted. |
| API-12 | Appointments | Reject double-booking the same doctor/slot | No conflict check exists in `AppointmentsController.Create` — confirmed by source review, not live-tested. Two different patients can book the same doctor at the same time with no rejection. |
| API-09 (duplicate license) | Doctors | Reject a second doctor with an already-used `licenseNumber` | Not tested live this pass — worth a follow-up check against `DoctorsController.Create`, which was not read for validation logic in this review. |

## Summary

Automated tests: 8/8 passed
Manual tests executed: 12
Manual tests passed: 10
Manual tests failed: 2 (both Critical, API-06 and API-09 — see Defect Log; API-09 additionally surfaced a High-severity crash, DEFECT-004, on retest with a real doctor ID)
Manual tests blocked (not implemented): 7
Manual tests not yet attempted: 1 (duplicate doctor license)

## Defects

See `QA_Defect_Log.md` for full detail. Summary:

| Defect ID | Severity | One-line description |
|---|---|---|
| DEFECT-001 | Critical | Public self-registration allows anyone to obtain an Admin-role JWT |
| DEFECT-002 | Critical | `DELETE` and `PUT /api/Doctors/{id}` have no authorization — any unauthenticated request can modify or delete doctor records |
| DEFECT-003 | Medium | `POST /api/Appointments` has no validation against past dates or double-booking the same doctor/slot (found via source review, not yet live-confirmed) |
| DEFECT-004 | High | Deleting a doctor with related records crashes with an unhandled `500` instead of a clean error — no FK pre-check, no try/catch |
