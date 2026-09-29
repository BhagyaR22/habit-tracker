# Personal Habit & Daily Activity Tracker

## 1. Database (once)
Open MySQL Workbench, open your working connection, open `backend/sql/setup.sql`,
run it (lightning bolt). It creates the database, the `habit_user` account and the 3 tables.
`backend/.env` is already filled in to match, so there is nothing to edit.

## 2. Backend
```bash
cd backend
npm install
npm run dev
```
Check http://localhost:5000/api/health -> {"status":"ok","db":"connected"}

## 3. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173, register, then log in.
