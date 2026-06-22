import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { ROUTES } from '../shared/constants/routes.js';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Search,
  Bell,
  Cpu
} from 'lucide-react';
import Button from '../shared/components/Button.jsx';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'New Interview', path: ROUTES.CREATE_INTERVIEW, icon: PlusCircle },
    { name: 'History', path: ROUTES.HISTORY, icon: History },
    { name: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`${ROUTES.HISTORY}?search=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 z-20 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 py-4 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-650 animate-pulse">
            <Cpu className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            MockAI
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-600 font-semibold'
                    : 'text-slate-550 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-650' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile (Desktop) */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-indigo-650 uppercase">
              {user?.name?.slice(0, 2) || 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">{user?.name}</p>
              <p className="text-xs truncate text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-slate-100"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-5 flex flex-col z-50">
            <div className="flex items-center justify-between py-2 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">MockAI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-750 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-600'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center gap-3 py-2">
                <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-indigo-650 uppercase">
                  {user?.name?.slice(0, 2) || 'US'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-slate-800">{user?.name}</p>
                  <p className="text-xs truncate text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 p-1.5 rounded-md hover:bg-slate-100"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          {/* Mobile Sidebar Trigger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <div className="md:hidden flex items-center gap-1.5">
              <Cpu className="h-5 w-5 text-indigo-650" />
              <span className="text-base font-bold text-slate-900">
                MockAI
              </span>
            </div>
            
            {/* Search Box (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-64 pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/40 transition-all duration-200"
              />
            </form>
          </div>

          {/* Right Header actions */}
          <div className="flex items-center gap-4">


            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-650 uppercase select-none">
                  {user?.name?.slice(0, 2) || 'US'}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-655 hover:text-slate-800">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-slate-200 shadow-lg py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Logged in as</p>
                      <p className="text-sm font-semibold truncate text-slate-800">{user?.name}</p>
                    </div>
                    <Link
                      to={ROUTES.ANALYTICS}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <BarChart3 className="h-4 w-4 text-slate-500" />
                      View Analytics
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-slate-50 hover:text-rose-650 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout Session
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
