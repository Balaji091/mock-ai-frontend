import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import EmptyState from '../shared/components/EmptyState.jsx';
import { FullPageLoader } from '../shared/components/Loader.jsx';
import { ROUTES } from '../shared/constants/routes.js';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Percent,
  Sparkles,
  Target,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { analytics, loading, fetchAnalytics } = useInterviewStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading && !analytics) {
    return <FullPageLoader message="Crunching numbers & building your dashboard..." />;
  }

  if (!analytics || analytics.timeline?.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <EmptyState
          title="No analytics data available"
          description="Complete at least one mock interview session to unlock detailed performance timelines, category maps, and focus area recommendations."
          actionText="Start AI Session"
          onActionClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
        />
      </div>
    );
  }

  const { metrics, insights, timeline, topicPerformance, weeklyActivity } = analytics;

  // Custom tooltips for light theme in Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="text-xs font-bold text-slate-800">
              {entry.name}: <span className="text-indigo-650">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomActivityTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{payload[0].payload.date}</p>
          <p className="text-xs font-bold text-slate-800">
            Sessions: <span className="text-indigo-655">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Convert practice time to hours & minutes
  const formatPracticeTime = (mins) => {
    if (!mins) return '0m';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-xs text-slate-505 mt-0.5">
            Identify patterns, chart improvement curves, and view recommendations
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_INTERVIEW)}>Start Practice</Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avg Score */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-150 text-indigo-655 shrink-0">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Average Score</span>
            <span className="text-lg font-bold text-slate-805">{metrics.averageScore}%</span>
          </div>
        </div>

        {/* Practice Time */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-150 text-blue-600 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Practice Time</span>
            <span className="text-lg font-bold text-slate-805">{formatPracticeTime(metrics.totalPracticeTime)}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-150 text-emerald-600 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Completed</span>
            <span className="text-lg font-bold text-slate-805">{metrics.completedInterviews} Session(s)</span>
          </div>
        </div>

        {/* Improvement */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-155 text-orange-605 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Improvement</span>
            <span className={`text-lg font-bold ${metrics.improvementPercentage >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {metrics.improvementPercentage >= 0 ? '+' : ''}{metrics.improvementPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Score Progression timeline */}
        <Card title="Scores Over Time" subtitle="Tracks your overall evaluation score progression line">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Overall Score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: '#818cf8', strokeWidth: 1.5, fill: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card title="Weekly Practice Frequency" subtitle="Daily interview counts completed over the past 7 days">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <Tooltip content={<CustomActivityTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Interviews"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Topic strengths */}
        <Card title="Average Performance by Topic" subtitle="Comparison of scores across practice modules" className="lg:col-span-2">
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} stroke="#cbd5e1" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="score"
                  name="Average Score"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Actionable Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strongest */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="text-emerald-705 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4.5 w-4.5 text-emerald-600" /> Strongest Field
          </div>
          <p className="text-base font-bold text-slate-905 pt-0.5">{insights.strongestTopic}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            You demonstrate robust concept retention and answer formatting in this area. Maintain this benchmark!
          </p>
        </div>

        {/* Weakest */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="text-rose-700 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4.5 w-4.5 text-rose-600" /> Growth Focus Topic
          </div>
          <p className="text-base font-bold text-slate-905 pt-0.5">{insights.weakestTopic}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your scores here indicate scope for concepts clarification. Schedule another session for focused practice.
          </p>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-5 space-y-2 shadow-sm">
          <div className="text-indigo-700 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4.5 w-4.5 text-indigo-650 animate-pulse" /> Focus Area Suggestion
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
            Based on your score metrics, you should focus on <strong className="text-slate-805">{insights.recommendedFocus}</strong>.
          </p>
          <button
            onClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
            className="text-[10px] text-indigo-600 hover:text-indigo-700 hover:underline font-semibold flex items-center gap-1 pt-1 cursor-pointer"
          >
            Start Practice Session Now <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
