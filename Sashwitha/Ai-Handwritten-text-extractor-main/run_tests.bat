@echo off
REM Helper script to run Playwright tests from project root
cd frontend
npx playwright test %*
