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

## License

MIT License - feel free to use and modify as needed.
