# Procurement Requisition Tracker

A modern, standalone web application for tracking procurement requisitions from request to invoice. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📝 **Requisition Management**: Create and track procurement requests
- 📄 **PO Tracking**: Record purchase order numbers and upload PO documents
- 💵 **Invoice Management**: Track invoice numbers and upload invoice documents
- 📎 **Document Gallery**: Upload and manage supporting documents
- 💾 **Local Storage**: All data stored in browser (no backend required)
- 📥 **Export/Import**: Export data as JSON for backup and sharing
- 🐳 **Docker Ready**: Containerized for easy deployment

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Inter font
- **State Management**: React hooks + localStorage
- **File Handling**: Browser FileReader API
- **Container**: Docker + Nginx

## Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production with Docker

```bash
# Build Docker image
docker build -t procurement-app .

# Run container
docker run -d -p 8080:80 procurement-app

# Open http://localhost:8080
```

## Usage

1. **Create Requisition**: Fill out the Details tab with all required information
2. **Submit for Approval**: Change status to "Submitted" 
3. **Add PO Information**: Once approved, use the PO Entry tab to record purchase order details
4. **Track Invoice**: Use the Invoice tab when supplier sends invoice
5. **Manage Documents**: Upload and organize all related documents in the Documents tab
6. **Export Data**: Use the Export button to save your data as JSON

## Data Storage

- All data is stored in browser localStorage
- No external database or backend required
- Export functionality for data backup and sharing
- Import functionality to restore from exported files

## File Upload

- Supports PDF, DOC, DOCX, JPG, PNG files
- 10MB file size limit
- Files stored as data URLs in browser
- Organized by type (PO, Invoice, Supporting, Other)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Commands

### Quick Start (Recommended)
```bash
# Start the app (builds and runs automatically)
./start.sh

# Stop the app
./stop.sh
```

### Manual Docker Commands
```bash
# Build and start with Docker Compose
docker-compose up --build -d

# Stop the app
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build --force-recreate -d
```

### Standalone Docker Commands
```bash
# Build image
docker build -t procurement-app .

# Run container (isolated)
docker run -d -p 8080:80 --name procurement-app-standalone procurement-app

# View logs
docker logs procurement-app-standalone

# Stop container
docker stop procurement-app-standalone

# Remove container
docker rm procurement-app-standalone
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎉 Latest Features (October 2024)

### 1. **Professional Line Items System**
- Add multiple line items to each requisition
- Professional table layout with inline editing
- Manual entry (no up/down spinner arrows)
- Auto-calculates totals in South African Rands (R)
- Delete individual items
- Clean, modern UI

### 2. **Sequential Approval Workflow**
- **4-step approval process:** Finance → COO → CFO → CEO
- Each approver must approve in order
- Visual progress tracking
- **No self-approval:** Users cannot approve their own requisitions
- Comments on each approval step
- Timestamps for all approvals

### 3. **Dashboard with Real-Time Notifications**
- **For Approvers:** Yellow "⚠️ ACTION REQUIRED" alert when requisitions need approval
- **For Requesters:** Real-time progress bar showing approval status
- Quick action buttons for common tasks
- Shows exactly which approver currently has the requisition

### 4. **Testing Mode** ⚠️
- **Currently Active:** Any email ending with `@dm-mineralsgroup.com` can login
- **Password:** `123` (for testing only)
- Auto-generates names from email addresses
- Perfect for testing with entire team
- **See:** `TESTING-MODE-GUIDE.md` for details

### 5. **Role-Based Access Control**
- **Approvers Only:** Access to PO and Invoice tabs (after full approval)
- **Requesters:** Can create and track requisitions
- **Admin:** Full system access
- Smart permission system

---

## 🔐 Authentication & Login

### Current Users (5 Approvers):
1. `solarcouple@gmail.com` - Solar Couple (Admin)
2. `lebone@dm-mineralsgroup.com` - Lebone Marule (Finance)
3. `sabelo@dm-mineralsgroup.com` - Sabelo Msiza (COO)
4. `joan@dm-mineralsgroup.com` - Joan Rinomhota (CFO)
5. `doctor@dm-mineralsgroup.com` - Doctor Motswadiri (CEO)

**All passwords:** `123` (change for production!)

### Testing Mode (Active):
**Any @dm-mineralsgroup.com email can login with password `123`**

Examples that work:
- `john.smith@dm-mineralsgroup.com` / `123`
- `sarah.jones@dm-mineralsgroup.com` / `123`
- `test.user@dm-mineralsgroup.com` / `123`

### GitHub Authentication (For Pushing Code):

**Device Code Authentication (Use Your Phone):**

When you need to push code from this Mac without storing credentials:

```bash
# Start device code authentication
gh auth login --web --git-protocol https

# You'll get a code like: F14E-7484
# On your phone, go to: https://github.com/login/device
# Enter the code and authenticate
# Then push your changes
git push origin main
```

**Benefits:**
- ✅ No password stored on work MacBook
- ✅ Authenticate from your phone
- ✅ One-time session
- ✅ Secure for work computers

---

## 📦 Latest Updates

### What's Been Added:
1. ✅ Complete Line Items System
2. ✅ Sequential Approval (Finance → COO → CFO → CEO)
3. ✅ Dashboard with Notifications
4. ✅ No Self-Approval Protection
5. ✅ Currency changed to Rands (R)
6. ✅ Testing Mode for easy team testing
7. ✅ Professional UI improvements

### Documentation Files:
- `TESTING-MODE-GUIDE.md` - How testing mode works and how to disable it
- `USER-ONBOARDING-GUIDE.md` - How to add new users securely
- `DEPLOY-NOW.md` - Deployment options and instructions
- `PASSWORD-RESET-GUIDE.md` - How to manage user passwords

---

## 🌍 Deployment

### Current Deployments:
- ✅ **Netlify:** Deployed and working worldwide
- ✅ **Docker:** Running on port 3050
- ✅ **GitHub:** Code repository at https://github.com/qqmakana/procurmentSystem

### Deployment Options:
See `DEPLOY-NOW.md` for complete deployment instructions including:
- Netlify Drop (easiest)
- Render.com
- Vercel
- Docker
- GitHub Pages

---

## 🔒 Security Notes

### Current (Testing Mode):
- ⚠️ Testing mode is **ACTIVE**
- ⚠️ Passwords stored in plain text
- ⚠️ Default password is `123`
- **For testing only - NOT production ready**

### Before Production:
1. Set `TESTING_MODE = false` in `src/components/Login.tsx`
2. Change all passwords from `123` to strong passwords
3. Add all real users to the user list
4. Implement password hashing
5. Set up proper backend authentication

See `USER-ONBOARDING-GUIDE.md` for production security checklist.

---

## License

MIT License - feel free to use and modify as needed.
