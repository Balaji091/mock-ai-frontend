import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import { useAuthStore } from '../store/authStore.js';
import { ROUTES } from '../shared/constants/routes.js';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import EmptyState from '../shared/components/EmptyState.jsx';
import { CardSkeleton } from '../shared/components/Loader.jsx';
import {
  Trophy,
  Activity,
  Flame,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  Brain,
  History
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const {
    analytics,
    history,
    loading,
    fetchAnalytics,
    fetchHistory
  } = useInterviewStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchHistory(1); // Fetch page 1 of history
  }, [fetchAnalytics, fetchHistory]);

  const metrics = analytics?.metrics || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
  };

  const recentInterviews = history?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      {/* Welcome & Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-50/50 via-slate-50/80 to-blue-50/40 border border-slate-200 p-6 md:p-8 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2">
            Ready for your next interview, {user?.name?.split(' ')[0]}?
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mb-5 leading-relaxed">
            Practice mock interviews with our advanced AI engine. Get real-time audio conversations, realistic technical questions, and a detailed performance breakdown.
          </p>
          <Button
            onClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
            icon={Plus}
          >
            Create New Interview
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {loading && !analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Interviews */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Interviews Taken
              </span>
              <span className="text-2xl font-bold text-slate-800">{metrics.totalInterviews}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>

          {/* Average Score */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Average Score
              </span>
              <span className="text-2xl font-bold text-indigo-650">{metrics.averageScore}%</span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Best Score */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Best Score
              </span>
              <span className="text-2xl font-bold text-emerald-600">{metrics.bestScore}%</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
              <Trophy className="h-6 w-6" />
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Current Streak
              </span>
              <span className="text-2xl font-bold text-orange-600">{metrics.currentStreak} Days</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-orange-600">
              <Flame className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Recent & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Interviews */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-slate-500" />
              Recent Practice Sessions
            </h2>
            <Link to={ROUTES.HISTORY} className="text-xs text-indigo-600 hover:text-indigo-500 hover:underline flex items-center gap-1">
              View All History <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading && history.length === 0 ? (
            <div className="space-y-3">
              <div className="h-16 bg-white border border-slate-200 rounded-lg animate-pulse" />
              <div className="h-16 bg-white border border-slate-200 rounded-lg animate-pulse" />
              <div className="h-16 bg-white border border-slate-200 rounded-lg animate-pulse" />
            </div>
          ) : recentInterviews.length === 0 ? (
            <EmptyState
              title="No interviews yet"
              description="Create your first interview session to start receiving AI-powered analytics and reports."
              actionText="Start First Interview"
              onActionClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
            />
          ) : (
            <div className="space-y-3">
              {recentInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all duration-205"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-800 truncate">{interview.topic}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-550 font-semibold uppercase tracking-wider">
                        {interview.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {interview.role} • {interview.duration} mins • {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div>
                      {interview.status === 'completed' ? (
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Score</span>
                          <span className={`text-base font-bold ${
                            interview.score >= 80 ? 'text-emerald-600' : interview.score >= 70 ? 'text-indigo-650' : 'text-amber-600'
                          }`}>
                            {interview.score}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded bg-amber-50 border border-amber-100 text-amber-705 font-semibold uppercase tracking-wider">
                          Incomplete
                        </span>
                      )}
                    </div>

                    <Button
                      variant={interview.status === 'completed' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        if (interview.status === 'completed') {
                          navigate(`/interviews/${interview._id}/result`);
                        } else {
                          navigate(`/interviews/${interview._id}`);
                        }
                      }}
                      icon={interview.status === 'completed' ? Trophy : Play}
                    >
                      {interview.status === 'completed' ? 'Report' : 'Resume'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Brain className="h-4.5 w-4.5 text-slate-500" />
            Quick Access
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <Link
              to={ROUTES.CREATE_INTERVIEW}
              className="rounded-xl bg-white border border-slate-200 p-4 block shadow-sm hover:border-slate-350 hover:shadow-md transition-all duration-200 group"
            >
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Setup AI Interview
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Choose a role (e.g. Frontend Dev) and technical topic to start a fully customized practice session.
              </p>
            </Link>

            <Link
              to={ROUTES.ANALYTICS}
              className="rounded-xl bg-white border border-slate-200 p-4 block shadow-sm hover:border-slate-350 hover:shadow-md transition-all duration-200 group"
            >
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Analyze Performance
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check score trends, review strengths and weaknesses by topics, and get recommended revision details.
              </p>
            </Link>
          </div>

          <Card title="Recruiter Pro Tip" className="bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-550 leading-relaxed">
              When responding to technical questions, structure your answers using the <strong className="text-slate-800">STAR method</strong> (Situation, Task, Action, Result) for behavioral questions, or explain your algorithmic approach and space/time complexities for coding problems.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
