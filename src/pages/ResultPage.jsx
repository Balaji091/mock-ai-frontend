import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import { ROUTES } from '../shared/constants/routes.js';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import { Spinner, FullPageLoader } from '../shared/components/Loader.jsx';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    activeInterview,
    activeResult,
    loading,
    fetchInterviewDetails,
    fetchInterviewResult,
  } = useInterviewStore();

  useEffect(() => {
    fetchInterviewDetails(id);
    fetchInterviewResult(id);
  }, [id, fetchInterviewDetails, fetchInterviewResult]);

  if (loading && (!activeResult || !activeInterview)) {
    return <FullPageLoader message="Analyzing your responses and building report..." />;
  }

  if (!activeResult || !activeInterview) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <HelpCircle className="h-10 w-10 text-rose-500 mb-4" />
        <h3 className="text-base font-semibold text-slate-800">Result Not Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This interview has not been completed or evaluated yet.
        </p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Back to Dashboard</Button>
      </div>
    );
  }

  // Map scores to Recharts format
  const scoresData = [
    { subject: 'Technical', score: activeResult.technicalScore },
    { subject: 'Communication', score: activeResult.communicationScore },
    { subject: 'Problem Solving', score: activeResult.problemSolvingScore },
    { subject: 'Confidence', score: activeResult.confidenceScore },
  ];

  // Helper to determine text colors based on score tiers
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-700 font-bold';
    if (score >= 70) return 'text-indigo-705 font-bold';
    return 'text-amber-700 font-bold';
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return 'bg-emerald-50 border border-emerald-250 text-emerald-700';
    if (score >= 70) return 'bg-indigo-50 border border-indigo-250 text-indigo-700';
    return 'bg-amber-50 border border-amber-250 text-amber-700';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold uppercase tracking-wider">
            Evaluation Report
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1.5">{activeInterview.topic}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role: {activeInterview.role} • Difficulty: {activeInterview.difficulty}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
            icon={RotateCcw}
          >
            Retake Practice
          </Button>
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            icon={ArrowRight}
          >
            Dashboard
          </Button>
        </div>
      </div>

      {/* Score Grid: Circular Gauge and Radar chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score Circle */}
        <div className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/2 rounded-full blur-2xl" />
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">Overall Assessment</h3>
          
          <div className="relative flex items-center justify-center">
            {/* SVG circle stroke */}
            <svg className="w-36 h-36">
              <circle
                className="text-slate-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="62"
                cx="72"
                cy="72"
              />
              <circle
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={389.5}
                strokeDashoffset={389.5 - (389.5 * activeResult.overallScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="62"
                cx="72"
                cy="72"
                transform="rotate(-90 72 72)"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">{activeResult.overallScore}%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Average</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 mt-6 font-medium leading-relaxed max-w-[200px]">
            Your rating sits in the <strong className={getScoreColorClass(activeResult.overallScore)}>
              {activeResult.overallScore >= 80 ? 'Superior' : activeResult.overallScore >= 70 ? 'Proficient' : 'Developing'}
            </strong> tier for this topic.
          </p>
        </div>

        {/* Sub-scores Graph mapping */}
        <div className="md:col-span-2 rounded-xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Category Performance Mapping</h3>
          
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoresData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths, Weaknesses, Improvement Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3.5 shadow-sm">
          <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" /> Key Strengths
          </h3>
          <ul className="space-y-2.5">
            {activeResult.strengths?.map((str, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-700 items-start leading-relaxed">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
            {(!activeResult.strengths || activeResult.strengths.length === 0) && (
              <span className="text-xs text-slate-500 block">No strengths reported.</span>
            )}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3.5 shadow-sm">
          <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <XCircle className="h-4.5 w-4.5 text-rose-600" /> Gaps & Weaknesses
          </h3>
          <ul className="space-y-2.5">
            {activeResult.weaknesses?.map((wk, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-700 items-start leading-relaxed">
                <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5" />
                <span>{wk}</span>
              </li>
            ))}
            {(!activeResult.weaknesses || activeResult.weaknesses.length === 0) && (
              <span className="text-xs text-slate-500 block">No weaknesses flagged.</span>
            )}
          </ul>
        </div>

        {/* Improvement Areas Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3.5 shadow-sm">
          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-600" /> Focus for Improvement
          </h3>
          <ul className="space-y-2.5">
            {activeResult.improvementAreas?.map((imp, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-700 items-start leading-relaxed">
                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                <span>{imp}</span>
              </li>
            ))}
            {(!activeResult.improvementAreas || activeResult.improvementAreas.length === 0) && (
              <span className="text-xs text-slate-500 block">No improvement actions outlined.</span>
            )}
          </ul>
        </div>

      </div>

      {/* Detailed Written Feedback Section */}
      <Card title="Detailed Qualitative Feedback" className="shadow-sm">
        <div className="prose prose-xs text-slate-700 leading-relaxed space-y-4">
          <p className="whitespace-pre-line text-xs md:text-sm">{activeResult.feedback}</p>
        </div>
      </Card>
      
    </div>
  );
};

export default ResultPage;
