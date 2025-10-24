# 🧪 Testing Mode Guide

## ⚠️ TESTING MODE IS CURRENTLY ACTIVE

### What This Means:

**Anyone with an @dm-mineralsgroup.com email can login with password `123`**

- `john.doe@dm-mineralsgroup.com` → Password: `123` ✅
- `sarah.smith@dm-mineralsgroup.com` → Password: `123` ✅  
- `anyname@dm-mineralsgroup.com` → Password: `123` ✅

**This is PERFECT for testing** but NOT secure for production!

---

## 📝 How It Works

### In Testing Mode:
1. System checks if email is in the predefined user list
2. If not found, checks if email ends with `@dm-mineralsgroup.com`
3. If yes AND password is `123`, user is allowed in
4. User's name is auto-generated from email (e.g., `john.doe` → "John Doe")

### Predefined Users (Always Work):
- `solarcouple@gmail.com` - Solar Couple (Admin)
- `lebone@dm-mineralsgroup.com` - Lebone Marule (Finance)
- `sabelo@dm-mineralsgroup.com` - Sabelo Msiza (COO)
- `joan@dm-mineralsgroup.com` - Joan Rinomhota (CFO)
- `doctor@dm-mineralsgroup.com` - Doctor Motswadiri (CEO)

---

## 🧪 Testing Examples

Try logging in with these emails (all use password `123`):

```
john.smith@dm-mineralsgroup.com
sarah.jones@dm-mineralsgroup.com
michael.brown@dm-mineralsgroup.com
procurement.team@dm-mineralsgroup.com
any.employee@dm-mineralsgroup.com
```

**All will work!** Perfect for testing with your team.

---

## 🔒 Switching to Production Mode

When you're ready to go live with proper security:

### Step 1: Edit Login Component

Open: `src/components/Login.tsx`

Find this line (around line 14):
```typescript
const TESTING_MODE = true;
```

Change it to:
```typescript
const TESTING_MODE = false;
```

### Step 2: Add All Real Users

Still in `src/components/Login.tsx`, add all your employees:

```typescript
const users = [
  // Approvers
  { email: 'solarcouple@gmail.com', password: 'SecurePass123!', name: 'Solar Couple', role: 'Admin' },
  { email: 'joan@dm-mineralsgroup.com', password: 'JoanSecure456!', name: 'Joan Rinomhota', role: 'CFO' },
  { email: 'sabelo@dm-mineralsgroup.com', password: 'SabeloPass789!', name: 'Sabelo Msiza', role: 'COO' },
  { email: 'lebone@dm-mineralsgroup.com', password: 'LebonePass012!', name: 'Lebone Marule', role: 'Finance' },
  { email: 'doctor@dm-mineralsgroup.com', password: 'DoctorPass345!', name: 'Doctor Motswadiri', role: 'CEO' },
  
  // Regular Users/Requesters
  { email: 'john.smith@dm-mineralsgroup.com', password: 'JohnPass678!', name: 'John Smith', role: 'Requester' },
  { email: 'sarah.jones@dm-mineralsgroup.com', password: 'SarahPass901!', name: 'Sarah Jones', role: 'Requester' },
  // ... add all your employees
];
```

### Step 3: Use Strong Passwords

**NEVER use `123` in production!**

Good password examples:
- `DM-Finance@2025!`
- `SecureCOO#2025`
- `Proc@urement$456`

### Step 4: Rebuild & Deploy

```bash
npm run build
docker-compose up -d --build
```

### Step 5: Share Credentials Securely

- Email passwords using encrypted email
- Or provide in person
- Never send via WhatsApp, SMS, or regular email
- Tell users to change password after first login

---

## 🎯 Current Setup (Testing Mode)

### Files Affected:
- `src/components/Login.tsx` - Main login logic

### What's Visible:
- Yellow warning banner on login screen
- "⚠️ TESTING MODE ACTIVE" message
- Instructions for test users

### What Works:
- All 5 approvers with proper roles
- Any @dm-mineralsgroup.com email with password `123`
- Auto-generated names from email addresses
- Full approval workflow
- Dashboard notifications
- Sequential approvals

---

## ⚡ Quick Reference

### Testing Mode ON (Current):
```typescript
const TESTING_MODE = true;  // Line 14 in Login.tsx
```
- ✅ Anyone @dm-mineralsgroup.com can login
- ✅ Password: 123 for all test users
- ✅ Perfect for demos and testing
- ⚠️ NOT secure for production

### Production Mode:
```typescript
const TESTING_MODE = false;
```
- ✅ Only predefined users can login
- ✅ Each user has unique password
- ✅ Secure for production use
- ⚠️ Must maintain user list manually

---

## 🔧 Future Enhancements (After Testing)

When moving to production, consider adding:

1. **Password Hashing**
   - Currently passwords stored in plain text
   - Use bcrypt or similar for hashing

2. **User Management UI**
   - Admin interface to add/remove users
   - No need to edit code

3. **Password Reset**
   - Email-based password recovery
   - Temporary password system

4. **Session Management**
   - Auto-logout after inactivity
   - Remember me functionality

5. **Two-Factor Authentication**
   - SMS or app-based 2FA
   - Extra security layer

---

## 📞 Support

### To Add Users During Testing:
Just tell them to use: `theirname@dm-mineralsgroup.com` with password `123`

### To Switch to Production:
1. Change `TESTING_MODE = false`
2. Add all real users with strong passwords
3. Rebuild and deploy
4. Share credentials securely

---

## ✅ Checklist: Before Going to Production

- [ ] Set `TESTING_MODE = false`
- [ ] Add all real users to user list
- [ ] Change all passwords from `123` to strong passwords
- [ ] Test login with all users
- [ ] Verify approvers can approve
- [ ] Verify requesters cannot approve
- [ ] Test complete approval workflow
- [ ] Backup user list somewhere safe
- [ ] Document password sharing process
- [ ] Train users on system

---

**Current Status:** 🧪 TESTING MODE ACTIVE  
**Last Updated:** October 24, 2025  
**Ready for Production:** NO (testing phase)

