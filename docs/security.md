# CarbonLens 360 — Security & Privacy Architecture

---

## 1. Zero-Trust Role Based Access Control (RBAC)

1. **Student / Teacher / Staff:** Authorized to access only their own private commute logs, activities, and wallet.
2. **Team Lead:** Limited to aggregated team progress and team challenge metrics.
3. **Canteen Staff:** Restricted to `/canteen` QR validation and redemption. Strictly prohibited from viewing student GPS history, home locations, or private carbon activity.
4. **Campus Admin:** Authorized for aggregate campus metrics, What-If simulation, and user record inspection. Every individual user record inspection generates an immutable entry in `audit_logs`.
5. **Sustainability Admin:** Management of campus projects, emission factors, and verification evidence.

---

## 2. Commute & Privacy Rules

- **No 24/7 Background Tracking:** Geolocation is accessed strictly during an active commute session initiated by user consent.
- **Camera Stream Privacy:** MediaStream is acquired on-demand and immediately stopped upon capture.
- **No Gallery File Upload for Commute Proof:** Prevents spoofing and ensures proof originates from live physical presence.
- **Short-Lived Signed QR Tokens:** 90-second expiration with server-side HMAC validation preventing replay attacks and race conditions.
- **Atomic Wallet Deductions:** Double-redemption is impossible due to single-use token consumption and atomic ledger balance updates.
