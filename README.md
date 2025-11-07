<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repo contains everything you need to run the Nodaysoffai AI Audit Co-Pilot locally.

View the hosted experience in AI Studio: https://ai.studio/apps/drive/1EI_CQciMwW6QUmVMVqQ4m4SPy1IUUsKn

## Features

- Real-time audit interview simulator with live transcription, pacing metrics, and auto-generated performance reports.
- Gemini-powered expert agent with a fast response mode and a deep "Thinking Mode" for complex strategy questions.
- Findings tracker with inline editing, severity filtering, and dashboard summaries that stay in sync with your data.
- Tailwind-based dashboard for documentation health, audit risk scoring, and role-based training plans.

## Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Configure environment variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your key:
   ```bash
   VITE_GEMINI_API_KEY=your-real-key
   ```
3. Restart the dev server whenever you change `.env.local`.

## Run locally

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000.

To build a production bundle:

```bash
npm run build
```
