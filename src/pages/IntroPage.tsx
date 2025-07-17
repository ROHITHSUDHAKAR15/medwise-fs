import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Shield, Zap, Users, Award, ArrowRight, Play, CheckCircle, Star, MessageSquare, Activity, Clock, Smartphone, Globe, TrendingUp, ChevronRight, Scan, Camera, FileText, Pill, Stethoscope, AlertCircle, Sparkles, Cpu, Database, Wifi, Lock, Eye, Mic, Volume2, Headphones, Gamepad2, Palette, Layers, BarChart3, PieChart, LineChart, Target, Compass, Map, Navigation, Rocket, Atom, Fingerprint, Smartphone as SmartphoneIcon, Tablet, Monitor, Watch, Bluetooth, Wifi as WifiIcon, Battery, Signal, CloudLightning, Server, HardDrive, Cpu as CpuIcon, MemoryStick, Usb, Headphones as HeadphonesIcon, Mic as MicIcon, Camera as CameraIcon, Video, Image, Music, Film, Radio, Tv, Speaker, Volume, VolumeX, Pause, SkipBack, SkipForward, Repeat, Shuffle, Download, Upload, Share, Link as LinkIcon, ExternalLink, Mail, Phone, MessageCircle, Send, Inbox, Archive, Trash, Edit, Save, Copy, Nut as Cut, Cast as Paste, Search, Filter, SortAsc as Sort, Grid, List, Calendar, Clock as ClockIcon, Timer, Watch as Stopwatch, AlarmClock, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning as CloudLightningIcon, Wind, Thermometer, Droplets, Umbrella, Sunrise, Sunset, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntroPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function IntroPage({ onLogin, onSignup }: IntroPageProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  // Responsive mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const heroSlides = [
    {
      title: "Your AI-Powered Healthcare Companion",
      subtitle: "Experience the future of healthcare with intelligent symptom tracking, personalized insights, and 24/7 medical assistance.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200",
      cta: "Start Your Health Journey",
      features: ["AI Medical Assistant", "Smart Health Tracking", "Emergency Support"]
    },
    {
      title: "Revolutionary AI Prescription Scanner",
      subtitle: "Instantly digitize prescriptions with 95%+ accuracy. Scan, extract, and automatically add medications to your tracker.",
      image: "https://cdn.analyticsvidhya.com/wp-content/uploads/2025/03/Building-a-Medical-Prescription-Scanner-using-PaliGemma-2-Mix-.webp?auto=format&fit=crop&q=80&w=1200",
      cta: "Scan Prescriptions",
      features: ["95% OCR Accuracy", "Instant Processing", "Auto-Add Medications"]
    },
    {
      title: "Smart Medication Management",
      subtitle: "Never miss a dose again with intelligent reminders, drug interaction alerts, and prescription scanning technology.",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=1200",
      cta: "Manage Medications",
      features: ["Smart Reminders", "Drug Interactions", "Refill Alerts"]
    },
    {
      title: "Emergency Care When You Need It",
      subtitle: "Instant access to emergency services, first aid guidance, and location sharing for critical situations.",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200",
      cta: "Emergency Features",
      features: ["Instant SOS", "First Aid Guide", "Location Sharing"]
    }
  ];

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI Medical Assistant",
      description: "Get instant medical advice and symptom analysis from our advanced AI system trained on medical knowledge.",
      color: "from-blue-500 to-blue-600",
      stats: "95% Accuracy",
      features: ["Natural Language Processing", "Medical Knowledge Base", "Symptom Analysis", "Health Recommendations"],
      demo: "Ask me anything about your health!"
    },
    {
      icon: Scan,
      title: "AI Prescription Scanner",
      description: "Revolutionary AI-powered OCR technology that instantly digitizes prescriptions with medical-grade accuracy.",
      color: "from-slate-600 to-slate-700",
      stats: "3 Sec Processing",
      features: ["Advanced OCR Technology", "Medical Text Recognition", "Auto-Medication Addition", "Prescription History"],
      demo: "Scan any prescription in seconds!"
    },
    {
      icon: Heart,
      title: "Smart Health Monitoring",
      description: "Track vital signs, symptoms, and health metrics with intelligent insights and trend analysis.",
      color: "from-red-500 to-red-600",
      stats: "24/7 Tracking",
      features: ["Vital Signs Monitoring", "Trend Analysis", "Health Insights", "Progress Tracking"],
      demo: "Monitor your health continuously!"
    },
    {
      icon: Shield,
      title: "Emergency Support System",
      description: "Quick access to emergency services, first aid guides, and location sharing for critical situations.",
      color: "from-green-500 to-green-600",
      stats: "Instant Access",
      features: ["Emergency SOS", "First Aid Guides", "Location Sharing", "Emergency Contacts"],
      demo: "Help is just one tap away!"
    }
  ];

  const advancedFeatures = [
    {
      icon: Cpu,
      title: "Machine Learning Insights",
      description: "Advanced algorithms analyze your health patterns",
      color: "text-blue-600"
    },
    {
      icon: Database,
      title: "Secure Health Records",
      description: "HIPAA-compliant data storage and management",
      color: "text-green-600"
    },
    {
      icon: Wifi,
      title: "Real-time Sync",
      description: "Seamless synchronization across all devices",
      color: "text-slate-600"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Military-grade security for your health data",
      color: "text-red-600"
    },
    {
      icon: Eye,
      title: "Visual Health Analytics",
      description: "Beautiful charts and insights for your health",
      color: "text-indigo-600"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Hands-free interaction with voice recognition",
      color: "text-slate-600"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
      quote: "The prescription scanner is a game-changer. My patients love how easy it is to digitize their medications.",
      rating: 5,
      hospital: "Mayo Clinic"
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      quote: "Scanning prescriptions takes seconds and the accuracy is incredible. No more manual entry mistakes!",
      rating: 5,
      condition: "Diabetes Management"
    },
    {
      name: "Emily Rodriguez",
      role: "Mother of 3",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150",
      quote: "Managing my family's prescriptions has never been easier. The AI catches details I would have missed.",
      rating: 5,
      family: "Family of 5"
    },
    {
      name: "Dr. James Wilson",
      role: "Emergency Physician",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150",
      quote: "The emergency features could save lives. Quick access to medical history and emergency contacts is crucial.",
      rating: 5,
      hospital: "Johns Hopkins"
    }
  ];

  const stats = [
    { number: "1M+", label: "Prescriptions Scanned", icon: FileText, color: "text-blue-600" },
    { number: "99.9%", label: "Uptime", icon: Activity, color: "text-green-600" },
    { number: "24/7", label: "AI Support", icon: Clock, color: "text-slate-600" },
    { number: "150+", label: "Countries", icon: Globe, color: "text-red-600" }
  ];

  const interactiveElements = [
    {
      title: "Smart Pill Recognition",
      description: "AI can identify pills from photos",
      icon: Pill,
      demo: "Take a photo of any pill"
    },
    {
      title: "Voice Health Assistant",
      description: "Talk to your health assistant",
      icon: Mic,
      demo: "Say 'How am I feeling today?'"
    },
    {
      title: "Health Score Calculator",
      description: "Real-time health scoring",
      icon: Target,
      demo: "Your health score: 85/100"
    },
    {
      title: "Symptom Predictor",
      description: "AI predicts potential health issues",
      icon: Brain,
      demo: "Based on your data..."
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Meta viewport for mobile scaling */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 dark:bg-black px-0 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-slate-500/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-red-500/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Interactive cursor follower */}
        <div 
          className="absolute w-4 h-4 bg-gradient-to-r from-blue-500 to-slate-500 rounded-full opacity-20 transition-all duration-300 ease-out pointer-events-none"
          style={{ 
            left: mousePosition.x - 8, 
            top: mousePosition.y - 8,
            transform: 'scale(1.5)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700" role="navigation" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center animate-pulse-custom">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
                MedWise
              </span>
            </div>

            {/* Navigation Links */}
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Features">Features</a>
              <a href="#scanner" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="AI Scanner">AI Scanner</a>
              <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="About">About</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Reviews">Reviews</a>
              {/* Auth Buttons (always visible on desktop) */}
              <button
                onClick={onLogin}
                className="ml-6 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="bg-gradient-to-r from-blue-600 to-slate-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Sign Up Free
              </button>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <svg className="w-7 h-7 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-700 animate-slide-down z-50">
              <a href="#features" className="block px-6 py-4 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="Features">Features</a>
              <a href="#scanner" className="block px-6 py-4 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="AI Scanner">AI Scanner</a>
              <a href="#about" className="block px-6 py-4 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="About">About</a>
              <a href="#testimonials" className="block px-6 py-4 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="Reviews">Reviews</a>
              {/* Auth Buttons (visible at bottom of mobile menu) */}
              <div className="flex flex-col gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogin(); }}
                  className="w-full text-slate-700 dark:text-slate-200 bg-transparent border border-slate-300 dark:border-slate-700 rounded-full py-2 font-medium hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onSignup(); }}
                  className="w-full bg-gradient-to-r from-blue-600 to-slate-600 text-white rounded-full py-2 font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Enhanced Sliding Content */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0 w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-110'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover max-w-full max-h-full"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block animate-slide-up">
                {heroSlides[currentSlide].title.split(' ').slice(0, 2).join(' ')}
              </span>
              <span className="block bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {heroSlides[currentSlide].title.split(' ').slice(2).join(' ')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              {heroSlides[currentSlide].features.map((feature, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={onSignup}
                className="bg-gradient-to-r from-blue-600 to-slate-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={() => setIsVideoPlaying(true)}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center animate-scale-in hover:scale-105 transition-transform duration-300"
                  variants={itemVariants}
                  transition={{ type: 'spring', stiffness: 80, damping: 16, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Features Section - Enhanced */}
      <section id="features" className="py-12 md:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {mainFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-700 overflow-hidden"
                  whileHover={{ scale: 1.06, rotateZ: 2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
                  variants={itemVariants}
                  transition={{ type: 'spring', stiffness: 80, damping: 16, delay: idx * 0.1 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        {feature.stats}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2 mb-6">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Demo */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Try it now:</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{feature.demo}"</p>
                      <button
                        onClick={onSignup}
                        className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* AI Prescription Scanner Showcase - Enhanced */}
      <section id="scanner" className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
              <Scan className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Revolutionary
              <span className="block bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                AI Prescription Scanner
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Transform paper prescriptions into digital medication schedules in seconds with our AI-powered OCR technology.
            </p>
          </div>

          {/* Interactive Demo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mb-8 md:mb-16">
            <div className="animate-slide-up">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How It Works
              </h3>
              <div className="space-y-6">
                {[
                  { icon: Camera, title: "Instant Capture", desc: "Take photos or upload images of prescriptions", color: "text-blue-600" },
                  { icon: Brain, title: "AI Processing", desc: "Advanced OCR extracts medication details", color: "text-slate-600" },
                  { icon: Pill, title: "Auto-Add Meds", desc: "Automatically adds to your medication tracker", color: "text-green-600" },
                  { icon: Shield, title: "Secure Storage", desc: "Encrypted storage of all prescription data", color: "text-red-600" }
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-up mt-8 md:mt-0" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"
                  alt="Prescription Scanner"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/20 to-slate-600/20 rounded-2xl"></div>
              </div>
              
              {/* Floating UI Elements */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">AI Processing</div>
                    <div className="text-lg font-bold text-slate-600 dark:text-slate-400">95% Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">Processing Speed</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">3 seconds average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {interactiveElements.map((element, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                whileHover={{ scale: 1.06, rotateZ: 2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 80, damping: 16, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <element.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{element.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{element.description}</p>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{element.demo}</div>
                <button
                  onClick={onSignup}
                  className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
                >
                  <span>Try Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.06, rotateZ: 2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
                variants={itemVariants}
                transition={{ type: 'spring', stiffness: 80, damping: 16, delay: index * 0.1 }}
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="relative w-full min-h-[18rem] sm:min-h-[20rem] md:min-h-[22rem] flex items-center justify-center overflow-hidden">
              <motion.div
                key={currentTestimonial}
                className="absolute inset-0 z-10"
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ type: 'spring', stiffness: 80, damping: 16 }}
                >
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-center h-auto w-full max-w-3xl mx-auto shadow-lg">
                      <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
                      />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start mb-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-4 italic">
                      "{testimonials[currentTestimonial].quote}"
                        </blockquote>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm">
                        {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].hospital || testimonials[currentTestimonial].condition || testimonials[currentTestimonial].family}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 via-slate-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform
              <span className="block">Your Healthcare Experience?</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join millions of users who trust MedWise for their healthcare needs. Start your journey to better health today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={onSignup}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={onLogin}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MedWise</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Empowering individuals to take control of their health with AI-powered insights and comprehensive healthcare management tools.
              </p>
              <div className="flex space-x-4">
                {[Smartphone, Globe, MessageSquare, Mail].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prescription Scanner</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MedWise. All rights reserved. Made with ❤️ for better healthcare.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-4xl w-full">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Demo video coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}