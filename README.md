# mk-wedding-rsvp-nodeapp

Wedding RSVP Backend Flow (Updated)

## Overview

The platform manages wedding RSVPs using **access codes** instead of online payments.

Payments are handled offline by the couple. After payment, the guest receives an access code to complete their RSVP.

---

## Guest Flow

1. Couple receives payment.
2. Couple gives guest an unused access code.
3. Guest visits the RSVP website.
4. Guest enters the access code.
5. Backend validates the code.
6. If valid, display RSVP form.
7. Guest provides:
   - Full name
   - Phone number
   - Email (optional)
   - Plus One? (Yes/No)
   - Plus One Name (optional)
8. Backend marks the access code as USED.
9. RSVP is created.
10. QR code is generated.
11. Guest downloads the QR code immediately.
12. Backend sends the RSVP details and QR code via WhatsApp and/or email.

---

## Manual Registration

Guests unable to use the website (especially older guests) can be registered directly through a protected backend endpoint (e.g. Postman).

The backend performs the same steps:
- Create RSVP
- Generate QR
- Send confirmation

Source values:
- ONLINE
- MANUAL

---

## Access Codes

Table:

- id
- code
- status (UNUSED | USED)
- usedByGuestId
- createdAt
- usedAt

Access Code Validation

A code is considered valid when:

- It exists.
- It has status = UNUSED.
- It has not expired (if expiration is introduced later).

Otherwise an appropriate error is returned.

---

## QR Code

The QR code should encode a unique guest identifier or check-in URL.

The visible design may display the guest's access code in the centre while keeping the QR fully scannable using a high error-correction level.

The QR code contains a secure check-in URL.

Example:

https://rsvp.domain.com/check-in/<guestId>

Scanning the QR opens the guest's RSVP record for verification and future check-in.

---

## Admin Authentication

- Single admin account
- JWT authentication
- Protected admin routes

---

## Admin Dashboard (v1)

- Dashboard statistics
- Search RSVP by guest name
- View guest details
- View RSVP list
- QR lookup/check-in
- View RSVP source (ONLINE / MANUAL)

Wedding-day workflow:
- Staff member A can search guests by name.
- Staff member B can scan a guest's QR code.
- Both methods lead to the same RSVP record.

---

## Future Check-in

After the client-facing website is complete:

- QR scan opens the guest record.
- Display:
  - Guest details
  - RSVP information
  - Plus one details
  - Check-in status
- Allow marking a guest as checked in.
- Prevent duplicate check-ins if desired.

---

## Deployment

- AWS EC2 (Ubuntu)
- Docker Compose
- Express API
- MySQL
- Nginx
- Let's Encrypt
