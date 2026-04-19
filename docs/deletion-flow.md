# Automated Portfolio Deletion Flow

## Status: Built, not yet activated

Requires one SQL migration before going live.

---

## SQL Migration (run in Supabase SQL Editor)

```sql
ALTER TABLE portfolios
  ADD COLUMN deletion_token TEXT,
  ADD COLUMN deletion_token_expires_at TIMESTAMPTZ;
```

---

## Files Created

| File | Purpose |
|---|---|
| `src/app/delete/page.tsx` | Request form (username + email input) |
| `src/app/delete/confirm/page.tsx` | Confirmation landing page (handles token from email link) |
| `src/app/api/request-deletion/route.ts` | Verifies username/email, stores token, sends confirmation email |
| `src/app/api/confirm-deletion/route.ts` | Verifies token, deletes portfolio row from Supabase |

---

## User Flow

1. User visits `/delete` → enters username + email
2. API verifies email matches portfolio on record
3. Secure 32-byte random token generated, stored in DB with 24hr expiry
4. Confirmation email sent via Resend with a one-time deletion link
5. User clicks **"Yes, delete my portfolio"** in email
6. `/delete/confirm?token=...` calls `/api/confirm-deletion`
7. Token verified → portfolio row permanently deleted
8. Page shows success / expired / invalid state

---

## Security Notes

- API always returns `{ success: true }` on the request step even if username/email don't match (prevents username enumeration)
- Tokens are 256-bit cryptographically random (32 bytes via `crypto.randomBytes`)
- Tokens expire after 24 hours
- One-time use — once the row is deleted, the token is gone

---

## Privacy Policy Update Needed

Once live, update section 10 of `/privacy` to remove:
> "We are working on a self-serve deletion feature."

And replace with:
> "You can delete your portfolio yourself at cvtoweb.com/delete."
