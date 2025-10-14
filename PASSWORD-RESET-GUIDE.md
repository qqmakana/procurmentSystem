# Password Reset Guide

## 🔑 Where Passwords Are Stored

**File**: `src/components/AuthSystem.tsx`  
**Lines**: 25-76  
**Array Name**: `users`

---

## 📋 Current Passwords (As of October 14, 2025)

| User | Email | Current Password | Role |
|------|-------|-----------------|------|
| Solar Couple | solarcouple@gmail.com | `q` | Admin |
| Lebone | lebone@dm-mineralsgroup.com | `password123` | Finance |
| Sabelo Msiza | sabelo@dm-mineralsgroup.com | `password123` | COO |
| Joan | joan@dm-mineralsgroup.com | `password123` | CFO |
| Doctor Motswadiri | doctor@dm-mineralsgroup.com | `password123` | CEO |

---

## 🔧 How to Change a Password

### Step-by-Step Instructions:

1. **Open the file**:
   ```bash
   # Navigate to the project
   cd /Users/qaqambilemakana/Desktop/procumentApp
   
   # Open in your code editor
   # The file is: src/components/AuthSystem.tsx
   ```

2. **Find the user** you want to change (around line 25-76)

3. **Change the password field**:
   ```typescript
   {
     id: 'user-1',
     name: 'Lebone',
     email: 'lebone@dm-mineralsgroup.com',
     password: 'NEW_PASSWORD_HERE',  // ← Change this
     role: 'Finance' as const,
     // ... rest of the user object
   }
   ```

4. **Save the file** (Ctrl+S or Cmd+S)

5. **Rebuild the application**:
   ```bash
   npm run build
   ```

6. **Restart the application**:
   - **If using dev server**: Stop (Ctrl+C) and restart `npm run dev`
   - **If using Docker**: 
     ```bash
     docker-compose down
     docker-compose up --build -d
     ```

---

## 🎯 Quick Examples

### Example 1: Change Admin Password

**Find this** (around line 26):
```typescript
{
  id: 'user-0',
  name: 'Solar Couple',
  email: 'solarcouple@gmail.com',
  password: 'q',
  // ...
}
```

**Change to**:
```typescript
{
  id: 'user-0',
  name: 'Solar Couple',
  email: 'solarcouple@gmail.com',
  password: 'admin2025',  // New password
  // ...
}
```

### Example 2: Change Lebone's Password

**Find this** (around line 36):
```typescript
{
  id: 'user-1',
  name: 'Lebone',
  email: 'lebone@dm-mineralsgroup.com',
  password: 'password123',
  // ...
}
```

**Change to**:
```typescript
{
  id: 'user-1',
  name: 'Lebone',
  email: 'lebone@dm-mineralsgroup.com',
  password: 'LeB0ne#2025',  // New password
  // ...
}
```

### Example 3: Change All Approvers to Same Password

**Before**:
```typescript
password: 'password123',  // All approvers have this
```

**After**:
```typescript
password: 'DM-Minerals-2025',  // All approvers now have this
```

---

## 💡 Password Best Practices

### For Production:
- ✅ Use strong passwords (minimum 12 characters)
- ✅ Mix uppercase, lowercase, numbers, and symbols
- ✅ Different password for each user
- ✅ Change default passwords immediately
- ✅ Don't share passwords via email or chat

### Examples of Strong Passwords:
- `Fin@nce#2025!DM`
- `C00-Appr0v3r$24`
- `CFO_Secure#789`
- `CEO!Admin@2025`

---

## 🚨 Important Notes

### Current System (Demo):
- Passwords are stored in **plain text** in the source code
- This is **ONLY for demo/development**
- **NOT secure for production**

### For Production:
- Passwords should be **hashed** (encrypted)
- Use a **real database** (not hardcoded)
- Implement **password reset flow** via email
- Add **two-factor authentication (2FA)**
- Use **secure backend API**

---

## 🔍 Finding the Password Section

### Visual Markers in the Code:

Look for this comment:
```typescript
// Mock user database (in real app, this would be a backend API)
const users = [
```

Then you'll see the array of users with passwords.

### File Structure:
```
src/
  components/
    AuthSystem.tsx  ← PASSWORDS ARE HERE
```

---

## 📞 Quick Help

### "I changed the password but it's not working"

1. **Did you save the file?** (Ctrl+S or Cmd+S)
2. **Did you rebuild?** Run `npm run build`
3. **Did you restart?** Restart the dev server or Docker
4. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
5. **Check for typos**: Make sure email and password match exactly

### "I forgot what I changed the password to"

1. Open `src/components/AuthSystem.tsx`
2. Look at lines 25-76
3. Find the user's email
4. The password is on the same line (after `password:`)

---

## 📋 Change Log Template

Keep track of password changes:

```
Date: _______________
User Changed: _______________
Old Password: _______________
New Password: _______________
Changed By: _______________
Reason: _______________
```

---

## 🎯 Summary

- **File**: `src/components/AuthSystem.tsx`
- **Location**: Lines 25-76
- **After changing**: Save → Rebuild (`npm run build`) → Restart
- **For production**: Implement proper password hashing and authentication

---

**Last Updated**: October 14, 2025


