# 🔒 Secure User Onboarding Guide

## Current Security Model

The procurement system uses a **pre-approved user model** for maximum security. There is NO public registration.

---

## 👥 Current Authorized Users

### Approvers (5 Users):
1. **Solar Couple** (Admin) - `solarcouple@gmail.com`
2. **Lebone Marule** (Finance) - `lebone@dm-mineralsgroup.com`
3. **Sabelo Msiza** (COO) - `sabelo@dm-mineralsgroup.com`
4. **Joan Rinomhota** (CFO) - `joan@dm-mineralsgroup.com`
5. **Doctor Motswadiri** (CEO) - `doctor@dm-mineralsgroup.com`

**All passwords:** `123` (change for production!)

---

## 🔐 How New Users Get Access

### Option 1: Admin-Created Accounts (Recommended)
Admin manually adds new users to the system:

1. Admin edits `src/components/Login.tsx`
2. Adds new user to the `users` array:
```typescript
{
  email: 'newuser@dm-mineralsgroup.com',
  password: 'temporaryPassword',
  name: 'New User Name'
}
```
3. Rebuild and redeploy the application
4. Provide credentials to the new user securely (encrypted email, SMS, or in-person)
5. User must change password on first login (future enhancement)

### Option 2: Request Access Process
For employees who need access:

1. **Employee contacts IT/Admin** via:
   - Email to admin
   - Internal help desk ticket
   - Direct request to supervisor

2. **Admin verifies** the request:
   - Checks employee is legitimate
   - Confirms they need procurement access
   - Determines appropriate role

3. **Admin creates account** (as per Option 1)

4. **Credentials shared securely**:
   - NOT via regular email
   - Use encrypted communication
   - Or provide in person

5. **First login**:
   - User logs in with temporary password
   - Must change password (future: force password change)

---

## 🚫 What We DON'T Allow

- ❌ Public self-registration
- ❌ Social media login (Google, Facebook, etc.)
- ❌ Password recovery via email (no "forgot password" publicly)
- ❌ Anonymous access

---

## 🔒 Security Features Implemented

### 1. **No Self-Approval**
- If Joan submits a requisition, Joan CANNOT approve it
- Even though Joan is a CFO approver
- System tracks who submitted (`requesterEmail`)
- Prevents conflict of interest

### 2. **Role-Based Access Control (RBAC)**
- **Regular Users**: Can only create and view requisitions
- **Approvers**: Can approve requisitions (but not their own)
- **Admin**: Can access all features

### 3. **Sequential Approval**
- Must go through all 4 approvers in order
- Finance → COO → CFO → CEO
- Cannot skip steps

### 4. **PO/Invoice Tab Access**
- Only approvers see these tabs
- Only after FULL approval
- Prevents tampering by requesters

---

## 📋 User Roles & Permissions

### Regular User (Requester)
**Can:**
- ✓ Create requisitions
- ✓ Add line items
- ✓ Upload documents
- ✓ Submit for approval
- ✓ View their own requisitions

**Cannot:**
- ✗ Approve requisitions
- ✗ Access PO/Invoice tabs
- ✗ See other users' requisitions (future enhancement)

### Approver (Finance, COO, CFO, CEO)
**Can:**
- ✓ Everything a Regular User can do
- ✓ View all submitted requisitions
- ✓ Approve/reject requisitions (except their own)
- ✓ Add approval comments
- ✓ Access PO/Invoice tabs (after full approval)

**Cannot:**
- ✗ Approve their own requisitions
- ✗ Skip approval steps
- ✗ Modify other users' submissions

### Admin (Solar Couple)
**Can:**
- ✓ Everything an Approver can do
- ✓ Override approvals (emergency only)
- ✓ Add new users (by editing code)
- ✓ Reset system data

**Cannot:**
- ✗ Approve requisitions they submitted themselves

---

## 🔄 Adding New Users - Step by Step

### For Admin:

1. **Collect Required Information:**
   - Full name
   - Email address (company email required)
   - Department
   - Role (Requester or Approver)

2. **Edit Login Component:**
   ```bash
   cd /Users/qaqambilemakana/Desktop/testing
   nano src/components/Login.tsx
   ```

3. **Add User to Array:**
   ```typescript
   const users = [
     // ... existing users ...
     { 
       email: 'newperson@dm-mineralsgroup.com', 
       password: 'TempPass123!', 
       name: 'New Person Name'
     },
   ];
   ```

4. **Rebuild Application:**
   ```bash
   npm run build
   ```

5. **Redeploy Docker Container:**
   ```bash
   docker-compose up -d --build
   ```

6. **Notify User Securely:**
   - Share credentials via encrypted message
   - Or provide credentials in person
   - Instruct to change password immediately

---

## 🚀 Future Enhancements

### Phase 2 Security Features (Not Yet Implemented):
- [ ] Force password change on first login
- [ ] Password complexity requirements
- [ ] Password expiry (90 days)
- [ ] User management UI (admin can add users via interface)
- [ ] Email verification for new users
- [ ] Two-factor authentication (2FA)
- [ ] Audit trail for all actions
- [ ] Session timeout (auto logout after inactivity)
- [ ] IP whitelist (restrict to office network)

### Phase 3 Enterprise Features:
- [ ] Integration with Active Directory / LDAP
- [ ] Single Sign-On (SSO)
- [ ] Department-based requisition visibility
- [ ] Approval delegation (when approver is away)
- [ ] Emergency approval bypass (with justification)

---

## ⚠️ Production Security Checklist

Before going to production:

- [ ] **Change all default passwords** (current: `123`)
- [ ] **Use strong passwords** (min 12 chars, mixed case, numbers, symbols)
- [ ] **Enable HTTPS** on deployment
- [ ] **Implement proper password hashing** (bcrypt, not plain text)
- [ ] **Add rate limiting** (prevent brute force attacks)
- [ ] **Enable security headers** (CSP, X-Frame-Options, etc.)
- [ ] **Set up backup system** (regular data backups)
- [ ] **Create admin procedures** (for adding/removing users)
- [ ] **Document emergency procedures** (what to do if system compromised)
- [ ] **Train users** on security best practices

---

## 📞 Support

### For Access Issues:
- Contact: Solar Couple (Admin)
- Email: solarcouple@gmail.com
- Or: Contact IT Department

### For Password Reset:
- Contact Admin directly
- Provide employee ID for verification
- Admin will reset password manually

---

## 📊 User Audit Log (Manual)

Keep a record of all user additions:

```
Date: _______________
User Added: _______________
Email: _______________
Role: _______________
Added By: _______________
Reason: _______________
Initial Password Set: Yes/No
User Notified: Yes/No
```

---

**Last Updated:** October 24, 2025
**Security Level:** Moderate (suitable for internal company use)
**Next Review:** Monthly

