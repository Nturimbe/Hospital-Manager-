# Backend/API QA Test Report

Tester: Nyognnu Nturimbe ID: 11254227
System: Hospital Management System

## Test Environment
Backend: ASP.NET Core Web API (.NET 10.0)
Database: (fill in — e.g. SQL Server LocalDB / EF Core InMemory for automated tests)
Date: 04th October, 2026
Branch/Commit: qa-backend-api

## Automated Test Run (xUnit)

| Project | Target Framework | Total | Passed | Failed | Skipped | Duration |
|---|---|---|---|---|---|---|
| HospitalManagement.API.Tests | net10.0 | 8 | 8 | 0 | 0 | 12.7s |

Command run: `dotnet test`
Result: Build succeeded with 4 warning(s). All 8 automated tests (ValidationTests + DatabaseModelTests) passed.

**Warning noted (not a test failure):** `NU1903` — `Microsoft.OpenApi` 2.0.0 has a known high-severity vulnerability (GHSA-v5pm-xwqc-g5wc), flagged on both `HospitalManagement.API.csproj` and `HospitalManagement.API.Tests.csproj`. Logged as a defect below which I am passing to Backend Engineer / DevOps for a package upgrade to fix it.

## Test Cases

| ID | Area | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| API-01 | Authentication | Register valid patient | Account created and JWT returned | | Not yet tested |
| API-02 | Authentication | Register duplicate email | Request rejected | | Not yet tested |
| API-03 | Authentication | Login valid credentials | JWT returned | | Not yet tested |
| API-04 | Authentication | Login wrong password | 401 Unauthorized | | Not yet tested |
| API-05 | Authorization | No token on protected endpoint | 401 Unauthorized | | Not yet tested |
| API-06 | Authorization | Patient calls Admin endpoint | 403 Forbidden | | Not yet tested |
| API-07 | Patients | Create valid patient | 201 Created | | Not yet tested |
| API-08 | Patients | Retrieve patient | Correct patient returned | | Not yet tested |
| API-09 | Doctors | Duplicate license number | 409 Conflict | | Not yet tested |
| API-10 | Appointments | Create future appointment | 201 Created | | Not yet tested |
| API-11 | Appointments | Create past appointment | Request rejected | | Not yet tested |
| API-12 | Appointments | Double-book doctor | 409 Conflict | | Not yet tested |
| API-13 | Appointments | Update status | Status changes | | Not yet tested |
| API-14 | EMR | Create valid medical record | 201 Created | | Not yet tested |
| API-15 | EMR | Wrong appointment/patient link | Request rejected | | Not yet tested |
| API-16 | EMR | Read patient records | Correct records returned | | Not yet tested |

## Summary
Total automated tests: 8
Passed: 8
Failed: 0
Blocked: 0

Total manual test cases: 16
Completed: 0
Remaining: 16 to be run against a live `dotnet run` instance with Postman/curl/HTTP client.

## Defects

| Defect ID | Test ID | Severity | Description | Assigned To | Status |
|---|---|---|---|---|---|
| BUG-001 | N/A (build warning) | Medium | `Microsoft.OpenApi` 2.0.0 has a known high-severity vulnerability (NU1903, GHSA-v5pm-xwqc-g5wc) | Backend Engineer / DevOps | Open