# Document Upload & Approval System Guide

## 🎯 Overview

This guide explains how the document upload and approval system works in the procurement application. The system allows requesters to upload supporting documents with their requisitions and enables approvers to review these documents before making approval decisions.

---

## 📋 How It Works (3 Simple Steps)

### Step 1: Upload Documents 📤
**Tab: Documents**

- Navigate to the **Documents** tab after logging in
- You'll see a clear guide at the top explaining the 3-step process
- Use the drag-and-drop area or click to browse and select files
- Supported formats: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Images (.jpg, .jpeg, .png)
- Maximum file size: 10MB per file
- You can upload multiple files (quotes, contracts, specifications, etc.)

**What You'll See:**
- A visual "How It Works" guide at the top
- Upload area with clear instructions
- All uploaded documents listed below with:
  - File name and type
  - File size and upload date
  - Who uploaded it
  - Download and Remove buttons

### Step 2: Submit for Approval 📨
**Tab: Submit**

- After uploading your documents, go to the **Submit** tab
- Review the submission requirements checklist:
  - ✓ Requisition Title
  - ✓ Requester Name
  - ✓ Justification
  - ✓ Line Items (at least one)
  - ✓ Supporting Documents (recommended)
- The system shows you how many documents are attached
- Preview the approval workflow that will be triggered
- Add optional comments for approvers
- Click **Submit for Approval**

**Approval Workflow:**
- **All requisitions**: Start with Finance approval (Lebone - lebone@dm-mineralsgroup.com)
- **Over R10,000**: Requires COO approval (Sabelo Msiza - sabelo@dm-mineralsgroup.com)
- **Over R50,000**: Requires CFO approval (Joan - joan@dm-mineralsgroup.com)
- **Over R100,000**: Requires CEO approval (Doctor Motswadiri - doctor@dm-mineralsgroup.com)

### Step 3: Approvers Review 👁️
**Tab: Queue (for approvers)**

Approvers can:
- See all pending requisitions assigned to them
- View requisition details including:
  - Total amount and priority level
  - Number of line items
  - **Number of attached documents** (highlighted)
- Click **"▶ View Details"** to expand and see:
  - All line items with pricing
  - **All supporting documents with:**
    - File names and types
    - Who uploaded them
    - **Download/View buttons** to review documents
- **Warning indicator** if no documents are attached
- Add approval/rejection comments
- Click **Approve** or **Reject**

---

## 🔑 Key Features

### For Requesters:
1. **Easy Upload Interface**
   - Simple drag-and-drop
   - Clear file type and size restrictions
   - Instant file preview

2. **Document Management**
   - View all uploaded documents
   - Download documents to verify
   - Remove documents if needed
   - See upload history (who, when)

3. **Visibility**
   - Know exactly how many documents are attached
   - See submission status
   - Track approval progress

### For Approvers:
1. **Document Access**
   - Expandable document section in approval queue
   - One-click download/view
   - See document metadata (type, uploader, date)

2. **Clear Indicators**
   - Warning if no documents attached
   - Document count in requisition summary
   - Easy-to-find document section

3. **Informed Decisions**
   - Review all supporting materials before approving
   - See full context (line items + documents + justification)
   - Add approval comments

---

## 💡 Best Practices

### What to Upload:
- ✓ **Supplier Quotes**: Justify pricing and vendor selection
- ✓ **Contracts/Agreements**: Show terms and conditions
- ✓ **Technical Specifications**: Help approvers understand requirements
- ✓ **Budget Approvals**: Show budget availability
- ✓ **Previous Correspondence**: Email chains or meeting notes

### When to Upload:
- **Before Submission**: Always upload documents before submitting for approval
- **Early in Process**: Upload as soon as you have the documents
- **Complete Set**: Upload all relevant documents at once

### File Organization:
- Use clear, descriptive file names (e.g., "Supplier_Quote_ABC_Corp_2025.pdf")
- Keep file sizes reasonable (compress large files)
- Upload only relevant documents

---

## 🚀 User Journey Examples

### Example 1: New Requisition with Documents

1. **Login** (john.doe@company.com / password123)
2. **Details Tab**: Create requisition
   - Title: "New Laptops for IT Team"
   - Add 5 line items (laptops, monitors, etc.)
3. **Documents Tab**: Upload documents
   - Upload supplier quote (PDF)
   - Upload technical specifications (PDF)
   - Upload budget approval email (PDF)
4. **Submit Tab**: Review and submit
   - See 3 documents attached ✓
   - Submit for approval
5. **Result**: Finance approver receives notification with all documents

### Example 2: Approver Reviews Requisition

1. **Login** as approver (jane.smith@company.com / finance123)
2. **Queue Tab**: See pending requisitions
3. **Click "▶ View Details"** on a requisition
4. **Review**:
   - Line items: 5 items totaling R75,000
   - Documents: 3 files attached
   - Click to download each document
5. **Decision**: Add comments and approve/reject

---

## 🔧 Technical Details

### File Storage:
- Files are converted to Data URLs and stored in localStorage
- Supported for demo purposes
- In production, would use cloud storage (AWS S3, Azure Blob, etc.)

### Security:
- All uploads logged with user info
- Timestamps tracked for audit trail
- Only authenticated users can upload/view

### Limitations:
- 10MB file size limit per file
- localStorage has ~10MB total limit
- For production, implement backend API

---

## 📊 System Flow Diagram

```
┌─────────────┐
│  Requester  │
└──────┬──────┘
       │
       ├─→ Details Tab: Create requisition
       ├─→ Documents Tab: Upload files
       └─→ Submit Tab: Submit for approval
              │
              ↓
       ┌─────────────┐
       │  Approvers  │
       └──────┬──────┘
              │
              ├─→ Queue Tab: See pending items
              ├─→ Expand Details: View documents
              ├─→ Download/Review: Examine files
              └─→ Approve/Reject: Make decision
```

---

## ❓ FAQ

**Q: Can I upload documents after submitting?**
A: Currently no. Upload all documents before submission.

**Q: What if I forget to upload documents?**
A: Approvers will see a warning. They may reject for lack of documentation.

**Q: Can approvers upload documents?**
A: Not in the current version. Only the original requester can upload.

**Q: How long are documents stored?**
A: In this demo, documents persist in browser localStorage until manually cleared.

**Q: Can I upload the same file twice?**
A: Yes, but each upload creates a separate document entry.

---

## 🎨 UI Improvements Made

1. **Documents Tab**:
   - Added "How It Works" visual guide at top
   - Improved upload area with clear instructions
   - Better document list styling (white on dark theme)
   - Added tips section at bottom

2. **Approval Queue**:
   - Added expandable document section
   - Document preview with file icons
   - Download buttons for each document
   - Warning indicator for missing documents
   - Expandable line items view

3. **Visual Consistency**:
   - Consistent styling across all tabs
   - Clear icons and labels
   - Professional color scheme
   - Mobile-responsive design

---

## 🚀 Next Steps for Production

1. **Backend Integration**:
   - Implement file upload API
   - Store files in cloud storage
   - Generate secure download URLs

2. **Enhanced Features**:
   - File preview (PDF viewer, image viewer)
   - Document versioning
   - Bulk upload
   - Document categories/tags

3. **Security**:
   - Virus scanning
   - Access control per document
   - Encryption at rest
   - Download audit logs

---

**For questions or support, contact the system administrator.**

Last Updated: October 14, 2025

