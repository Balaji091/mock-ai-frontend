import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import EmptyState from '../shared/components/EmptyState.jsx';
import { TableSkeleton } from '../shared/components/Loader.jsx';
import { Search, SlidersHorizontal, ArrowLeft, Trophy, Play, RotateCcw, Calendar } from 'lucide-react';
import { ROUTES } from '../shared/constants/routes.js';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const {
    history,
    totalHistory,
    totalPages,
    currentPage,
    loading,
    fetchHistory,
  } = useInterviewStore();

  const [search, setSearch] = useState(initialSearch);
  const [difficulty, setDifficulty] = useState('All');
  const [status, setStatus] = useState('All');

  // Trigger fetch when parameters or page changes
  useEffect(() => {
    fetchHistory(1, search, difficulty, status);
  }, [search, difficulty, status, fetchHistory]);

  const handlePageChange = (page) => {
    fetchHistory(page, search, difficulty, status);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Practice History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your past performances and resume active interview sessions
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_INTERVIEW)}>New Session</Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by topic or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
          />
        </div>

        {/* Difficulty filter */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 text-slate-700 px-4 py-2.5 text-xs transition-all outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 text-slate-700 px-4 py-2.5 text-xs transition-all outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
        </div>

      </div>

      {/* Main Table view */}
      {loading && history.length === 0 ? (
        <TableSkeleton />
      ) : history.length === 0 ? (
        <EmptyState
          title="No interview matches found"
          description="Try broadening your search term or adjusting filters to discover past practices."
          actionText="Create New Session"
          onActionClick={() => navigate(ROUTES.CREATE_INTERVIEW)}
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Desktop Table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Topic / Role</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{row.topic}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{row.role}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 uppercase text-[9px] font-bold">
                          {row.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {row.duration} Mins
                      </td>
                      <td className="px-6 py-4">
                        {row.status === 'completed' ? (
                          <span className={`font-bold ${
                            row.score >= 80 ? 'text-emerald-700' : row.score >= 70 ? 'text-indigo-755' : 'text-amber-700'
                          }`}>
                            {row.score}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                          row.status === 'completed'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : row.status === 'active'
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                            : 'bg-amber-50 border border-amber-200 text-amber-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={row.status === 'completed' ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => {
                            if (row.status === 'completed') {
                              navigate(`/interviews/${row._id}/result`);
                            } else {
                              navigate(`/interviews/${row._id}`);
                            }
                          }}
                          icon={row.status === 'completed' ? Trophy : Play}
                        >
                          {row.status === 'completed' ? 'Report' : 'Resume'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stack layout (falls back nicely on smaller ports) */}
            <div className="block sm:hidden divide-y divide-slate-100 p-4 space-y-4">
              {history.map((row) => (
                <div key={row._id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-805">{row.topic}</p>
                      <p className="text-[10px] text-slate-500">{row.role}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                      row.status === 'completed'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                    }`}>
                      {row.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Date: {new Date(row.createdAt).toLocaleDateString()}</span>
                    <span>Dur: {row.duration} Mins</span>
                    <span>Diff: {row.difficulty}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    {row.status === 'completed' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500">Score:</span>
                        <span className="font-bold text-slate-800">{row.score}%</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Progress: Incomplete</span>
                    )}

                    <Button
                      variant={row.status === 'completed' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        if (row.status === 'completed') {
                          navigate(`/interviews/${row._id}/result`);
                        } else {
                          navigate(`/interviews/${row._id}`);
                        }
                      }}
                      icon={row.status === 'completed' ? Trophy : Play}
                    >
                      {row.status === 'completed' ? 'Report' : 'Resume'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Showing page {currentPage} of {totalPages} ({totalHistory} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
