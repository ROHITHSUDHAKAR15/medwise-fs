import React from 'react';
import { useStore } from '../store';
import { User } from '../types';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, Heart, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoginProps {
  defaultMode?: 'login' | 'signup';
  onBack?: () => void;
}

export default function Login({ defaultMode = 'login', onBack }: LoginProps) {
  const setUser = useStore((state) => state.setUser);
  const { success, error } = useToast();
  const [isSignup, setIsSignup] = React.useState(defaultMode === 'signup');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<User>>({
    email: '',
    password: '',
    name: '',
    age: undefined,
    gender: 'male',
    bloodType: 'A+',
    weight: undefined,
    height: undefined,
    allergies: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = React.useState(false);

  const motivationalQuotes = [
    "Your health is your wealth!",
    "Every step counts. Start your journey today.",
    "Small changes make a big difference.",
    "Stay positive, stay healthy!",
    "You are your best investment."
  ];
  const randomQuote = React.useMemo(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], []);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Use BACKEND_URL for real API calls, e.g.:
  // await fetch(`${BACKEND_URL}/auth/login`, ...)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignup) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (isSignup) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.age || formData.age < 1 || formData.age > 150) {
        newErrors.age = 'Please enter a valid age';
      }
      if (!formData.emergencyContact?.name) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!formData.emergencyContact?.phone) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isSignup) {
        // Simulate signup - replace with actual API call
        setUser({
          id: Date.now().toString(),
          role: 'patient',
          ...formData,
          name: sanitizeInput(formData.name!),
          email: sanitizeInput(formData.email!),
        } as User);
        success('Account Created', 'Welcome to MedWise!');
      } else {
        // Simulate login - replace with actual API call
        setUser({
          id: '1',
          name: 'ROHITH',
          email: sanitizeInput(formData.email!),
          role: 'patient',
          age: 30,
          gender: 'male',
        } as User);
        success('Login Successful', 'Welcome back to MedWise!');
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (err) {
      error('Authentication Error', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value) || undefined : value,
      }));
    }
  };

  return (
    <>
      <SEOHead 
        title={isSignup ? 'Sign Up - MedWise' : 'Login - MedWise'}
        description={isSignup ? 'Create your MedWise account' : 'Login to your MedWise account'}
      />
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.8, x: -100, y: -100 }} animate={{ opacity: 0.18, scale: 1, x: 0, y: 0 }} transition={{ duration: 1.2 }} className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl" style={{ filter: 'blur(80px)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }} animate={{ opacity: 0.14, scale: 1, x: 0, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }} className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full blur-3xl" style={{ filter: 'blur(70px)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.8, x: 0, y: 100 }} animate={{ opacity: 0.12, scale: 1, x: 0, y: 0 }} transition={{ duration: 1.7, delay: 0.4 }} className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ filter: 'blur(60px)' }} />
        {/* Floating Sparkles */}
        <motion.div animate={{ y: [0, -20, 0], opacity: [0.12, 0.18, 0.12] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className="absolute top-24 left-1/3">
          <Sparkles className="w-10 h-10 text-blue-300" />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0], opacity: [0.10, 0.16, 0.10] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }} className="absolute bottom-32 right-1/4">
          <Sparkles className="w-8 h-8 text-purple-300" />
        </motion.div>
        <motion.div animate={{ x: [0, 30, 0], opacity: [0.10, 0.15, 0.10] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 2 }} className="absolute top-1/3 right-1/2">
          <Sparkles className="w-7 h-7 text-pink-300" />
        </motion.div>
      </div>
      <div 
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-pattern opacity-30 z-0"></div>
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          )}

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }} className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome to MedWise
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Your AI-Powered Healthcare Assistant
              </p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4 flex items-center justify-center gap-2 text-blue-500 dark:text-blue-300 text-sm font-medium">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>{randomQuote}</span>
              </motion.div>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mb-8" role="tablist">
              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  !isSignup 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                role="tab"
                aria-selected={!isSignup}
              >
                Login
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isSignup 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                role="tab"
                aria-selected={isSignup}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <>
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <motion.input
                      id="name"
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={`input-enhanced ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                    />
                    {errors.name && (
                      <p id="name-error" className="form-error" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Age and Gender Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="age" className="form-label">Age *</label>
                      <motion.input
                        id="age"
                        type="number"
                        name="age"
                        required
                        min="1"
                        max="150"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        className={`input-enhanced ${errors.age ? 'error' : ''}`}
                        placeholder="Age"
                        aria-invalid={!!errors.age}
                        aria-describedby={errors.age ? 'age-error' : undefined}
                        whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                      />
                      {errors.age && (
                        <p id="age-error" className="form-error" role="alert">
                          {errors.age}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="select-enhanced"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Blood Type */}
                  <div className="form-group">
                    <label htmlFor="bloodType" className="form-label">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Blood Type
                    </label>
                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="select-enhanced"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Emergency Contact
                    </h3>
                    
                    <div className="form-group">
                      <label htmlFor="emergencyContactName" className="form-label">Contact Name *</label>
                      <motion.input
                        id="emergencyContactName"
                        type="text"
                        name="emergencyContact.name"
                        required
                        value={formData.emergencyContact?.name || ''}
                        onChange={handleInputChange}
                        className={`input-enhanced ${errors.emergencyContactName ? 'error' : ''}`}
                        placeholder="Emergency contact name"
                        aria-invalid={!!errors.emergencyContactName}
                        aria-describedby={errors.emergencyContactName ? 'emergency-name-error' : undefined}
                        whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                      />
                      {errors.emergencyContactName && (
                        <p id="emergency-name-error" className="form-error" role="alert">
                          {errors.emergencyContactName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="emergencyContactRelationship" className="form-label">Relationship</label>
                        <input
                          id="emergencyContactRelationship"
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact?.relationship || ''}
                          onChange={handleInputChange}
                          className="input-enhanced"
                          placeholder="e.g., Spouse, Parent"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="emergencyContactPhone" className="form-label">Phone *</label>
                        <motion.input
                          id="emergencyContactPhone"
                          type="tel"
                          name="emergencyContact.phone"
                          required
                          value={formData.emergencyContact?.phone || ''}
                          onChange={handleInputChange}
                          className={`input-enhanced ${errors.emergencyContactPhone ? 'error' : ''}`}
                          placeholder="Phone number"
                          aria-invalid={!!errors.emergencyContactPhone}
                          aria-describedby={errors.emergencyContactPhone ? 'emergency-phone-error' : undefined}
                          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                        />
                        {errors.emergencyContactPhone && (
                          <p id="emergency-phone-error" className="form-error" role="alert">
                            {errors.emergencyContactPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email address *
                </label>
                <motion.input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`input-enhanced ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                />
                {errors.email && (
                  <p id="email-error" className="form-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password *
                </label>
                <div className="relative">
                  <motion.input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    className={`input-enhanced pr-12 ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
                    transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="form-error" role="alert">
                    {errors.password}
                  </p>
                )}
                {isSignup && (
                  <p className="form-help">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-lg font-semibold"
                whileHover={{ scale: 1.07, boxShadow: '0 4px 18px 0 rgba(0,0,0,0.16)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <>
                    {isSignup ? 'Create Account' : 'Sign In'}
                    <Heart className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {isSignup ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
            {/* Confetti/Sparkle Effect on Success */}
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                  <Sparkles className="w-24 h-24 text-blue-400 animate-spin-slow" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}