# Approver Login Credentials

## 🔑 DM Minerals Group - Procurement System

### Admin Account
- **Name**: Solar Couple
- **Email**: `solarcouple@gmail.com`
- **Password**: `q`
- **Role**: Admin
- **Permissions**: Full system access, user management, all approvals

---

### Finance Approver
- **Name**: Lebone
- **Email**: `lebone@dm-mineralsgroup.com`
- **Password**: `password123`
- **Role**: Finance
- **Approves**: All requisitions (first level)

---

### COO Approver
- **Name**: Sabelo Msiza
- **Email**: `sabelo@dm-mineralsgroup.com`
- **Password**: `password123`
- **Role**: COO
- **Approves**: Requisitions over R10,000

---

### CFO Approver
- **Name**: Joan
- **Email**: `joan@dm-mineralsgroup.com`
- **Password**: `password123`
- **Role**: CFO
- **Approves**: Requisitions over R50,000

---

### CEO Approver
- **Name**: Doctor Motswadiri
- **Email**: `doctor@dm-mineralsgroup.com`
- **Password**: `password123`
- **Role**: CEO
- **Approves**: Requisitions over R100,000

---

## 📊 Approval Workflow

### Amount-Based Approval Levels

| Requisition Amount | Approval Required |
|-------------------|------------------|
| Any amount | Finance (Lebone) |
| > R10,000 | Finance → COO (Sabelo Msiza) |
| > R50,000 | Finance → COO → CFO (Joan) |
| > R100,000 | Finance → COO → CFO → CEO (Doctor Motswadiri) |

---

## 🔐 Security Notes

1. **Demo Passwords**: All approver accounts use `password123` for demo purposes
2. **Production**: Change all passwords before deploying to production
3. **Email Domain**: All approvers use `@dm-mineralsgroup.com` domain
4. **Sequential Approvals**: Approvals must be completed in order

---

## 📝 Quick Login Guide

### For Approvers:

1. **Open the application**: http://localhost:8080 (Docker) or http://localhost:5173 (dev)
2. **Click on the email/password fields** at the top
3. **Enter your email** from the list above
4. **Enter password**: `password123`
5. **Click "Login"**
6. **Navigate to "Queue" tab** to see pending approvals

---

## 🎯 Testing the System

### Test Scenario 1: Small Purchase (under R10,000)
- Login as: Lebone (Finance)
- Approve directly
- No further approvals needed

### Test Scenario 2: Medium Purchase (R10,000 - R50,000)
1. Login as: Lebone (Finance) → Approve
2. Login as: Sabelo Msiza (COO) → Approve
3. Approval complete

### Test Scenario 3: Large Purchase (R50,000 - R100,000)
1. Login as: Lebone (Finance) → Approve
2. Login as: Sabelo Msiza (COO) → Approve
3. Login as: Joan (CFO) → Approve
4. Approval complete

### Test Scenario 4: Very Large Purchase (over R100,000)
1. Login as: Lebone (Finance) → Approve
2. Login as: Sabelo Msiza (COO) → Approve
3. Login as: Joan (CFO) → Approve
4. Login as: Doctor Motswadiri (CEO) → Approve
5. Approval complete

---

**Last Updated**: October 14, 2025


