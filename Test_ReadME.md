# Testing

The backend uses **Vitest** for automated service-layer testing.

The v1 test suite focuses on the core business services where failures would directly affect the RSVP and wedding-day workflow.

## Test Coverage

### 1. Access Code Service

File:

`src/modules/access-code/access-code.service.test.ts`

Tests:

- Generates the requested number of access codes.
- Prevents duplicate access codes from being generated when a code already exists.
- Returns access codes ordered by newest first.
- Returns details for an existing access code.
- Throws an error when an access code does not exist.

**Tests: 5**

---

### 2. Guest Service

File:

`src/modules/guest/guest.service.test.ts`

Tests:

- Validates an existing unused access code.
- Rejects an invalid access code.
- Rejects an access code that has already been used.
- Creates an RSVP successfully.
- Marks the access code as used after RSVP creation.
- Searches for guests by supported search fields.
- Returns the appropriate RSVP data.
- Handles RSVP lookup failures.

**Tests: 8**

---

### 3. Check-in Service

File:

`src/modules/check-in/check-in.service.test.ts`

Tests:

- Finds a guest using their QR token.
- Handles guests without an access code.
- Rejects an invalid QR token.
- Successfully checks in a guest.
- Updates the check-in status and timestamp.
- Prevents duplicate check-ins.

**Tests: 6**

---

### 4. Letter Service

File:

`src/modules/letter/letter.service.test.ts`

Tests:

- Creates a guest letter successfully.
- Correctly handles an optional relationship field.

**Tests: 2**

---

## Current Test Results

The current v1 service test suite contains:

- **4 test files**
- **21 tests**
- **21 passing**
- **0 failing**

```text
Test Files  4 passed (4)
Tests       21 passed (21)