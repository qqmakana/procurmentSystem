# Procurement System - User Guide

## Overview
The Procurement System is a professional application for managing purchase requisitions with a multi-level approval workflow.

## Key Features

### 1. Authentication
Login with your credentials to access the system. Demo accounts are available for testing.

### 2. Requisition Management
**Details Tab:**
- Create and manage line items
- Add item descriptions, quantities, and unit prices
- View total amount calculations
- Add justification and requester information

### 3. Document Management
**Documents Tab:**
- Upload supporting documents (PDF, DOC, DOCX, XLS, XLSX, images)
- Drag and drop support
- View and remove uploaded files
- 10MB file size limit per file

### 4. Approval Workflow
**Automatic Approval Routing:**
- **Up to R10,000:** Finance approval (Lebone)
- **R10,001 - R50,000:** Finance + COO approval (Lebone + Sabelo Msiza)
- **R50,001 - R100,000:** Finance + COO + CFO approval (Lebone + Sabelo Msiza + Joan)
- **Over R100,000:** Finance + COO + CFO + CEO approval (All four approvers)

**Submit Tab:**
- Review submission requirements
- View approval workflow preview
- Submit requisition when ready

**Approval Tab:**
- View all approval steps
- Approve/reject requisitions (if you're an approver)
- Add comments to approvals/rejections
- Track approval status

**Queue Tab:**
- View all pending requisitions (approvers)
- Filter by status
- Quick approval actions
- See priority based on amount

### 5. Purchase Orders & Invoices
**PO Tab:**
- Enter PO number from your ERP system
- Select PO issue date
- Upload official PO document

**Invoice Tab:**
- Enter invoice number
- Select invoice received date
- Upload invoice document

### 6. Data Management (Admin Only)
**Data Tab:**
- View storage usage statistics
- Create complete data backups
- Restore data from backup files
- Clear all data (with confirmation)

### 7. User Management (Admin Only)
**Users Tab:**
- View all system users
- Add new users
- Edit user details
- Manage roles and permissions
- Activate/deactivate users

## User Roles

### Requester
- Create requisitions
- Submit for approval
- View own requisitions
- Upload documents

### Finance (Lebone)
- All Requester permissions
- Approve requisitions at Finance level
- View all requisitions

### COO (Sabelo Msiza)
- All Requester permissions
- Approve requisitions at COO level (over R10,000)
- View all requisitions

### CFO (Joan)
- All Requester permissions
- Approve requisitions at CFO level (over R50,000)
- View all requisitions

### CEO (Doctor Motswadiri)
- All Requester permissions
- Approve requisitions at CEO level (over R100,000)
- View all requisitions
- Final approval authority

### Admin
- Full system access
- User management
- Data management
- All approval permissions

## Quick Start Guide

### For Requesters:
1. **Login** with your credentials
2. Go to **Details** tab
3. Fill in requisition information
4. Add line items (description, quantity, price)
5. Go to **Documents** tab and upload supporting docs
6. Go to **Submit** tab
7. Review and click "Submit for Approval"
8. Track status in **Approval** tab

### For Approvers:
1. **Login** with your credentials
2. Check **Notifications** (bell icon) for pending approvals
3. Go to **Queue** tab to see all pending items
4. Click "Review & Approve" on requisitions requiring your approval
5. Add comments (optional for approval, required for rejection)
6. Click **Approve** or **Reject**

### For Admins:
**Backup Data:**
1. Login as admin
2. Go to **Data** tab
3. Click "Backup Now" to download all data

**Restore Data:**
1. Go to **Data** tab
2. Click "Restore" and select backup file
3. System will reload with restored data

**User Management:**
1. Go to **Users** tab
2. Click "Add User" to create new accounts
3. Edit or delete existing users as needed

## Tips & Best Practices

### Requisition Creation
- ✅ Provide clear, detailed item descriptions
- ✅ Include comprehensive justification
- ✅ Upload all relevant supporting documents
- ✅ Double-check quantities and prices

### Approvals
- ✅ Review all line items carefully
- ✅ Check supporting documents
- ✅ Verify amounts and calculations
- ✅ Add meaningful comments, especially for rejections
- ✅ Act on pending approvals promptly

### Data Management
- ✅ Create regular backups (weekly recommended)
- ✅ Store backup files securely
- ✅ Test restore process periodically
- ✅ Monitor storage usage

## Support & Troubleshooting

### Common Issues

**Can't submit requisition:**
- Ensure all required fields are filled
- Add at least one line item
- Verify total amount is calculated

**Documents won't upload:**
- Check file size (must be under 10MB)
- Verify file type is supported
- Try a different file format

**Can't see approval options:**
- Verify you're logged in with correct account
- Check if you're the assigned approver for that step
- Ensure requisition is in "Pending" status

### Data Storage
All data is stored locally in your browser. For long-term data retention and sharing across devices, use the backup/restore feature regularly.

### Browser Compatibility
Best experienced on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

---

## Demo Accounts

**Admin Access:**
- Email: solarcouple@gmail.com
- Password: q

**Finance (Lebone):**
- Email: lebone@company.com
- Password: password123

**COO (Sabelo Msiza):**
- Email: sabelo.msiza@company.com
- Password: password123

**CFO (Joan):**
- Email: joan@company.com
- Password: password123

**CEO (Doctor Motswadiri):**
- Email: doctor.motswadiri@company.com
- Password: password123

---
*For additional support, please contact your system administrator.*




