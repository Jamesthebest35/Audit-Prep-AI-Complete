<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Audit Preparedness Co-Pilot

> An AI-powered platform for comprehensive audit preparation and compliance management

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Jamesthebest35/Audit-Prep-AI-Complete)
[![Node](https://img.shields.io/badge/node-v20.x-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue.svg)](https://www.typescriptlang.org)

## 🚀 Features

### 📊 Compliance Dashboard
- Real-time predictive compliance scoring
- Risk assessment and tracking
- Documentation health metrics
- Quality objectives monitoring

### 🔍 Findings Tracker
- Comprehensive audit findings management (CRUD operations)
- Severity-based filtering (Major, Minor, Observation)
- Status tracking (On Track, At Risk, Overdue)
- Owner assignment and due date management

### 🤖 Expert Audit Agent
- AI-powered chatbot using Google Gemini
- Two operation modes:
  - **Fast Mode**: Quick responses with streaming
  - **Thinking Mode**: Deep analysis with extended reasoning
- Expert knowledge in ISO, SOC, PCI DSS, SOX frameworks

### 🎯 Audit Simulation Engine
- Voice-based audit interview practice
- Real-time performance metrics
- Filler word detection and confidence scoring
- Post-interview performance reports
- Multiple audit scenarios (ISO 27001, SOC 2, ISO 9001, SOX)

### 📚 Training Paths
- Role-based training modules
- Customized learning paths for:
  - C-Suite Executives
  - Process Owners & Department Heads
  - Front-Line Employees

## 📋 Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **Docker** (optional, for containerized deployment)
- **Google Gemini API Key** - [Get yours here](https://ai.google.dev/)

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Jamesthebest35/Audit-Prep-AI-Complete.git
cd Audit-Prep-AI-Complete
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🔨 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:prod       # Build with production mode
npm run preview          # Preview production build
npm run type-check       # Run TypeScript type checking
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:compose:up    # Start with Docker Compose
npm run docker:compose:down  # Stop Docker Compose services
```

## 🐳 Docker Deployment

### Using Docker

```bash
# Build the image
docker build -t audit-prep-ai --build-arg VITE_GEMINI_API_KEY=your_api_key .

# Run the container
docker run -d -p 80:80 --name audit-prep-ai audit-prep-ai
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Comprehensive deployment instructions
- **[API Documentation](https://ai.google.dev/docs)** - Google Gemini API docs

## 🏗️ Tech Stack

- **Frontend**: React 19.2 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts 3.3
- **AI**: Google Gemini API
- **Server**: Nginx (production)
- **Container**: Docker + Docker Compose

## 📁 Project Structure

```
Audit-Prep-AI-Complete/
├── components/
│   ├── shared/          # Reusable components (Card, Icon)
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── dashboard/       # Dashboard components
│   ├── findings/        # Findings tracker
│   ├── agent/          # AI expert agent
│   ├── audit-simulation/  # Audit simulation engine
│   └── training/        # Training paths
├── utils/              # Utility functions (logger)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── nginx.conf          # Nginx server configuration
```

## 🔒 Security

- Environment variables for sensitive data
- Content Security Policy (CSP) headers
- XSS protection
- HTTPS enforcement (production)
- Regular dependency audits

## 🚀 Deployment

This application can be deployed to:

- **Docker** (Recommended)
- **Vercel**
- **Netlify**
- **AWS** (S3 + CloudFront)
- **Google Cloud Platform** (Cloud Run)
- **Azure** (Container Instances)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔧 CI/CD

The project includes GitHub Actions workflows for:
- Automated testing and type checking
- Docker image building and publishing
- Security vulnerability scanning
- Deployment notifications

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: support@nodaysoffai.com

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- Powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-12
**Status**: Production Ready ✅
