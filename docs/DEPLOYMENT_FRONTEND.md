# Frontend Deployment

Owner: 22173900

## Platform
Netlify

## Production
Frontend URL: https://hms-ug-hospital-portal.netlify.app
Backend API URL: https://hospital-manager-deploy.onrender.com/api

## Build Settings
Base directory: frontend (the task file names frontend/hospital-management-ui, but the repository folder is `frontend`)
Build command: npm run build
Publish directory: dist

## Environment
VITE_API_URL configured in Netlify (https://hospital-manager-deploy.onrender.com/api). The same value is baked into the uploaded build. `frontend/.env.example` documents it.

## How it was deployed
The team repository is private and Netlify could not read it, so the production build was made locally (`VITE_API_URL=<api url> npm run build`) and the `dist` folder was uploaded with Netlify Drop. The source branch is `devops-frontend-netlify`, created from `frontend-doctor-admin` because `main` contains no frontend code yet.

## Routing
`frontend/public/_redirects` contains `/*    /index.html   200`, so React Router paths survive a refresh.

## CORS
The backend allows only the exact origin https://hms-ug-hospital-portal.netlify.app (Render variable `FrontendUrl`). A request from an unlisted origin receives no CORS headers.

## Verification
- [x] Production build succeeds
- [x] Netlify deployment succeeds
- [x] Login reaches Render API
- [x] No CORS error for the Netlify origin (preflight checked)
- [x] Protected page loads after login
- [x] React routes survive refresh (/login and /doctor return 200)
- [x] Browser console checked
- [x] Incognito smoke test passed

## Known limitations
- The frontend calls `/appointments` and `/medical-records`, which the backend did not have. They were added by DevOps on branch `devops-backend-endpoints` for the backend authors to review.
- Registration does not create a patient profile, so booking an appointment creates a minimal patient row (see the backend branch).
- The admin dashboard loads patients, doctors and appointments in one `Promise.all`; if one request fails, none of the counts load.
- The Render Free plan sleeps when idle; the first request can take up to a minute.

- On 4 Oct 2026 the hosted database provider temporarily blocked one of Render's shared outbound addresses (automatic protection against repeated failed logins). The API returned errors until the provider unblocked it. Render outbound addresses are shared with other customers, so this can recur until the provider exempts Render's ranges; a support request asking for that has been sent.

## Smoke test result (4 Oct 2026, incognito window)
On https://hms-ug-hospital-portal.netlify.app against the live Render API: login, booking an appointment, refreshing a non-home route, signing out and in again, and the browser console were checked and worked.