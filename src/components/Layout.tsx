import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Stethoscope, 
  AlertCircle,
  Apple,
  Brain,
  Clock,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Settings,
  Scan
} from 'lucide-react';
import { useStore } from '../store';
import SEOHead from './SEOHead';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Layout() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const location = useLocation();
  const [chatTooltip, setChatTooltip] = useState(false);
  const [emergencyTooltip, setEmergencyTooltip] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/', description: 'Overview & quick stats' },
    { name: 'AI Chat', icon: MessageSquare, path: '/chat', description: 'Medical AI assistant' },
    { name: 'Prescription Scanner', icon: Scan, path: '/prescription-scanner', description: 'AI prescription scanning' },
    { name: 'Medications', icon: Clock, path: '/medications', description: 'Medication reminders' },
    { name: 'Disease Predictor', icon: Stethoscope, path: '/disease-predictor', description: 'Predict diseases from symptoms' },
    { name: 'Diet & Exercise', icon: Apple, path: '/health', description: 'Health metrics' },
    { name: 'Mental Health', icon: Brain, path: '/mental-health', description: 'Mood tracking' },
    { name: 'Emergency', icon: AlertCircle, path: '/emergency', description: 'Emergency services' },
  ];

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
      if (showProfileMenu && !target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, showProfileMenu]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 bg-pattern">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between p-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gradient">MedWise</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="btn-icon text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-slate-500/20"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                className="menu-button btn-icon text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-slate-500/20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <nav 
          className={`mobile-menu fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 border-r border-slate-200 dark:border-slate-700 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
              aria-label="MedWise home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">MedWise</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Healthcare Assistant</p>
              </div>
            </Link>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  onKeyDown={(e) => handleKeyDown(e, () => setShowProfileMenu(!showProfileMenu))}
                  className="profile-button w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                  aria-expanded={showProfileMenu}
                  aria-haspopup="true"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">{user.name[0]}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </button>
                
                {showProfileMenu && (
                  <div className="profile-menu absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 animate-slide-down border border-slate-200 dark:border-slate-700" role="menu">
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center transition-colors focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center transition-colors focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-6 py-4 text-slate-700 dark:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset mx-3 rounded-xl mb-1 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-2 rounded-lg mr-4 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs ${
                      isActive 
                        ? 'text-blue-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="lg:pl-72">
          <main className="p-4 sm:p-6 pt-20 lg:pt-6" role="main">
            <Suspense fallback={<LoadingSpinner showOverlay={true} />}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="animate-fade-in"
                >
              <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>

        {/* Enhanced Mobile menu overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
      {/* Floating Chatbot and Emergency Buttons (stacked bottom right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-3">
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => navigate('/chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 animate-bounce-custom"
            aria-label="AI Chatbot"
            onMouseEnter={() => setChatTooltip(true)}
            onMouseLeave={() => setChatTooltip(false)}
            onFocus={() => setChatTooltip(true)}
            onBlur={() => setChatTooltip(false)}
          >
            <MessageSquare className="w-8 h-8" />
            <span className="sr-only">AI Chatbot</span>
          </button>
          {/* Tooltip */}
          <div
            className={`pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 bg-slate-900 text-white dark:bg-slate-800 dark:text-blue-200 opacity-0 scale-95 ${chatTooltip ? 'opacity-100 scale-100' : ''}`}
            role="tooltip"
            aria-hidden={!chatTooltip}
          >
            AI Chatbot
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-md select-none hidden sm:inline-block">AI Chat</span>
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => navigate('/emergency')}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 animate-bounce-custom"
            aria-label="Emergency Help"
            onMouseEnter={() => setEmergencyTooltip(true)}
            onMouseLeave={() => setEmergencyTooltip(false)}
            onFocus={() => setEmergencyTooltip(true)}
            onBlur={() => setEmergencyTooltip(false)}
          >
            <AlertCircle className="w-8 h-8" />
            <span className="sr-only">Emergency Help</span>
          </button>
          {/* Tooltip */}
          <div
            className={`pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 bg-slate-900 text-white dark:bg-slate-800 dark:text-red-200 opacity-0 scale-95 ${emergencyTooltip ? 'opacity-100 scale-100' : ''}`}
            role="tooltip"
            aria-hidden={!emergencyTooltip}
          >
            Emergency Help
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold shadow-md select-none hidden sm:inline-block">Emergency</span>
      </div>
    </>
  );
}