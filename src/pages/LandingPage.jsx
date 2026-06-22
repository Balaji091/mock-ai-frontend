import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes.js';
import Button from '../shared/components/Button.jsx';
import {
  Cpu,
  Mic,
  Award,
  ArrowRight,
  Sparkles,
  History,
  BarChart3,
  CheckCircle,
  Play
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-650">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            MockAI
          </span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.LOGIN}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Sign Up Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-glow-radial py-16 md:py-24 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Next-Gen Interview Prep
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Master Technical Interviews with <span className="text-indigo-600">Adaptive AI</span>
          </h1>
          <p className="text-sm md:text-base text-slate-550 leading-relaxed max-w-2xl mx-auto">
            Experience realistic, voice-based mock interviews. Practice explaining your thoughts aloud with real-time speech transcription, adaptive questions, and get comprehensive performance analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="md"
              onClick={() => navigate(ROUTES.REGISTER)}
              icon={Play}
            >
              Get Started for Free
            </Button>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center gap-1 text-xs font-bold text-indigo-605 hover:text-indigo-700 hover:underline transition-all"
            >
              Access your Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What is MockAI & Why Implemented */}
      <section className="bg-white border-t border-b border-slate-200 py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto rounded-2xl my-8 shadow-sm">
        {/* What is it */}
        <div className="space-y-4">
          <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">What is MockAI?</h3>
          <p className="text-xs md:text-sm text-slate-550 leading-relaxed">
            MockAI is an AI-powered conversational simulator built to bridge the gap in technical interview preparation. While typical platforms focus strictly on silent coding challenges, MockAI tests your ability to **articulate solutions verbally**—a critical skill that hiring managers and recruiters look for.
          </p>
          <ul className="space-y-2 pt-2">
            {[
              'Verbal AI questions with natural voice output',
              'Real-time text transcribing of your voice responses',
              'Context-aware follow-up questions simulating a senior engineer',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why it was implemented */}
        <div className="space-y-4">
          <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-650">
            <Mic className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Why was it implemented?</h3>
          <p className="text-xs md:text-sm text-slate-550 leading-relaxed">
            Many engineers write exceptional code but struggle to communicate their design decisions, edge cases, and runtime complexities. MockAI was built to solve this exact bottleneck. By replicating a live conversational technical round, it builds your confidence, polishes your vocabulary, and removes the stress of live peer evaluations.
          </p>
          <ul className="space-y-2 pt-2">
            {[
              'Reduces anxiety through self-paced private simulations',
              'Pinpoints gaps in terminology (e.g. JWT, SQL Joins)',
              'Provides structural STAR and engineering feedback logs',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Core Features */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Platform Features at a Glance</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Everything you need to practice, analyze, and boost your performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3.5 shadow-sm">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg w-fit">
              <Mic className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-905">Real-time Voice Dialogues</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Speak naturally. Our system transcribes your answers on-the-fly and processes them through an LLM trained to act like an experienced senior developer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3.5 shadow-sm">
            <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg w-fit">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-905">Multi-dimensional Analytics</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track category performance across Technical, Communication, Problem Solving, and Confidence sub-scores, plotted on interactive radar and area charts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-3.5 shadow-sm">
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg w-fit">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-905">Targeted Improvement Areas</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get an overall score report showing clear bullet-point breakdowns of your key strengths, gaps, and specific recommendations on what to study next.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer block */}
      <section className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border-t border-slate-200 py-16 px-6 text-center space-y-5">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Start Practicing in Seconds</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Create a free account, customize your interview topic, targets, difficulty, and jump into the room immediately.
        </p>
        <div className="pt-2">
          <Button
            size="md"
            onClick={() => navigate(ROUTES.REGISTER)}
            icon={Play}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} MockAI Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
