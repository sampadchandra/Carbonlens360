# CarbonLens 360 — End-to-End Demo Walkthrough Guide

---

## Complete Core Product Loop Walkthrough

### 1. Student / Commuter Journey
1. **Open CarbonLens 360:** Select **Student Demo** from the Role Switcher at the top.
2. **Navigate to Commute Hub (`/commute`):**
   - Click **Start Commute**.
   - Select **Bicycle** or **Bus**.
   - The **Live Camera Viewfinder** opens (using your device camera stream).
   - Click **Capture Photo Evidence** (no gallery file picker permitted).
   - Review photo & click **Use Live Photo**.
   - Real-time GPS distance and speed telemetry start recording.
   - Click **Arrive at Campus & Complete Trip**.
   - Immediate verification: Campus geofence passed, CO2 reduction computed against car baseline, $+161\text{ Green Credits}$ earned instantly!
   - Click **"Why Should I Trust This?"** to view the full evidence trace.

3. **Rewards & Canteen QR Generation (`/rewards`):**
   - View updated wallet balance ($1,011\text{ Green Credits}$).
   - Click **Redeem ₹20 Canteen Discount**.
   - A signed QR code appears with a live 90-second countdown timer and token code (e.g. `QR-A9F321B0`).

### 2. Canteen Staff POS Redemption Journey
4. **Switch to Canteen Staff (`/canteen`):**
   - In the top bar, switch role to **Canteen Staff**.
   - The dedicated scanner terminal opens with live camera scanning and token input.
   - The student's token code is scanned/entered.
   - Click **Validate & Scan QR**.
   - Server performs atomic verification: shows **APPROVED**, ₹20 discount applied, 180 credits deducted, student name, and transaction ID (`CL-TXN-XXXX`).
   - Try scanning the same QR again: server rejects with **"Double-redemption alert!"**.

### 3. Campus & Sustainability Admin Journey
5. **Campus Dashboard (`/campus`):**
   - Switch role to **Campus Admin**.
   - Inspect Campus Carbon footprint ($1,450.5\text{ tCO}_2\text{e}$), transport split (bicycles 42%, bus 18%, cars 4%), hostel & department rankings.
   - Open **Campus Projects** to view the **250kW Rooftop Solar Digital Passport** and credit readiness evaluation.
   - Open **What-If Simulator** to model 60% Solar or EV adoption with instant ROI and payback period.

6. **Live Admin Database Monitor (`/admin/data`):**
   - View the live PostgreSQL database table rows: `Users`, `Trips`, `Green Credit Ledger`, `Canteen Redemptions`, `Activities`, and `Audit Logs`.
   - Every student trip and canteen scan is permanently reflected in real time!
