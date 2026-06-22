# MockAI Frontend - React Client

A premium, clean light-themed web interface for **MockAI**, an interactive, voice-enabled AI Mock Interview Platform. Built using React 19, Vite, Zustand, and Tailwind CSS.

---

## 🚀 Key Features

- **Adaptive Voice-Enabled Interview Room**: Simulates live technical rounds with real-time Speech Synthesis (TTS) voice engines and browser Speech-to-Text (STT) mic transcribers.
- **Custom Modals**: Uses clean, non-blocking React components for manual termination confirmations and timeout alerts.
- **Persistent Sessions**: Stores remaining countdown limits in local cache by interview ID to support seamless dashboard returns and page-leave resumes.
- **Detailed Assessments**: Visualizes Technical, Communication, Problem Solving, and Confidence ratings using Recharts charts and category performance mapping.
- **Insight Timelines**: Charts weekly practice frequencies, score progressions, and study focus area highlights.

---

## 🛠️ Technology Stack

- **Framework**: React 19 & Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4 (Light theme palette)
- **Charts**: Recharts (Radar, Area, Line, and SVG gauges)
- **Icons**: Lucide React
- **Form Validation**: React Hook Form

---

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.production` or `.env.local` if deploying to a host (like Vercel) and specify your hosted API base URL:
   ```env
   VITE_API_URL=https://your-deployed-backend-url.onrender.com/api
   ```
   *Note: Locally, Vite will automatically proxy requests to `http://localhost:5000/api` through relative `/api` basePaths.*

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   The compiled static assets will be outputted to the `dist/` directory.
