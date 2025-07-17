import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Stethoscope, 
  AlertCircle, 
  Apple, 
  Brain, 
  Clock,
  Activity,
  Heart,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Calendar,
  BarChart3,
  Plus,
  Bell,
  Settings,
  ChevronRight,
  Target,
  Award,
  Thermometer,
  Droplet,
  Scan,
  Camera,
  Sparkles,
  Cpu,
  Database,
  Wifi,
  Lock,
  Eye,
  Mic,
  Volume2,
  Headphones,
  Gamepad2,
  Palette,
  Layers,
  PieChart,
  LineChart,
  Compass,
  Map,
  Navigation,
  Rocket,
  Atom,
  Fingerprint
} from 'lucide-react';
import { useStore } from '../store';
import { useToast } from '../hooks/useToast';
import { motion, useAnimation, useInView } from 'framer-motion';
import AccessibleModal from '../components/AccessibleModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const medications = useStore((state) => state.medications);
  const symptoms = useStore((state) => state.symptoms);
  const moodEntries = useStore((state) => state.moodEntries);
  const healthMetrics = useStore((state) => state.healthMetrics);
  const appointments = useStore((state) => state.appointments);
  const { info, success } = useToast();
  
  const [stats, setStats] = React.useState({
    heartRate: Math.floor(Math.random() * (100 - 60) + 60),
    steps: Math.floor(Math.random() * 10000),
    sleep: Math.floor(Math.random() * 10),
    waterIntake: Math.floor(Math.random() * 8),
  });

  const [showAppointmentModal, setShowAppointmentModal] = React.useState(false);
  const [appointment, setAppointment] = React.useState({
    doctorName: 'Dr. Smith',
    specialty: 'General Checkup',
    date: 'Tomorrow',
    time: '2:00 PM',
    location: 'City Clinic',
    notes: 'Bring previous reports',
  });

  const features = [
    {
      name: 'AI Chat',
      description: 'Get instant medical advice from our AI assistant',
      icon: MessageSquare,
      path: '/chat',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      stats: '24/7 Available',
      action: () => {
        navigate('/chat');
        info('AI Chat', 'Starting conversation with medical AI assistant');
      }
    },
    {
      name: 'Prescription Scanner',
      description: 'Scan prescriptions with AI-powered OCR technology',
      icon: Scan,
      path: '/prescription-scanner',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      stats: '95% Accuracy',
      action: () => {
        navigate('/prescription-scanner');
        info('Prescription Scanner', 'Access AI-powered prescription scanning');
      }
    },
    {
      name: 'Disease Predictor',
      description: 'Predict diseases based on your symptoms',
      icon: Stethoscope,
      path: '/disease-predictor',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      stats: 'Smart Analysis',
      action: () => {
        navigate('/disease-predictor');
        info('Disease Predictor', 'Predict diseases from your symptoms');
      }
    },
    {
      name: 'Emergency Help',
      description: 'Quick access to emergency services and first aid',
      icon: AlertCircle,
      path: '/emergency',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      stats: 'Instant Access',
      action: () => {
        navigate('/emergency');
        info('Emergency Services', 'Access emergency contacts and first aid');
      }
    },
    {
      name: 'Diet & Exercise',
      description: 'Track your nutrition and fitness goals',
      icon: Apple,
      path: '/health',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      stats: 'Health Metrics',
      action: () => {
        navigate('/health');
        info('Health Metrics', 'Monitor your health and fitness data');
      }
    },
    {
      name: 'Mental Health',
      description: 'Monitor your mental wellbeing and get support',
      icon: Brain,
      path: '/mental-health',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      stats: 'Mood Tracking',
      action: () => {
        navigate('/mental-health');
        info('Mental Health', 'Track your mood and practice mindfulness');
      }
    },
    {
      name: 'Medications',
      description: 'Manage your medications and get reminders',
      icon: Clock,
      path: '/medications',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      stats: 'Smart Reminders',
      action: () => {
        navigate('/medications');
        info('Medications', 'Manage your medication schedule and reminders');
      }
    }
  ];

  const quickStats = [
    {
      label: 'Heart Rate',
      value: stats.heartRate,
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: '+2%',
      changeType: 'positive',
      action: () => {
        navigate('/health');
        info('Heart Rate', 'View detailed heart rate trends');
      }
    },
    {
      label: 'Daily Steps',
      value: stats.steps.toLocaleString(),
      unit: 'steps',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+12%',
      changeType: 'positive',
      action: () => {
        navigate('/health');
        info('Activity', 'Track your daily activity and exercise');
      }
    },
    {
      label: 'Sleep',
      value: stats.sleep,
      unit: 'hours',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '-5%',
      changeType: 'negative',
      action: () => {
        navigate('/health');
        info('Sleep Tracking', 'Monitor your sleep patterns');
      }
    },
    {
      label: 'Water Intake',
      value: stats.waterIntake,
      unit: 'glasses',
      icon: Droplet,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      change: '+8%',
      changeType: 'positive',
      action: () => {
        navigate('/health');
        info('Hydration', 'Track your daily water intake');
      }
    }
  ];

  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Quick access to emergency services',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      action: () => {
        navigate('/emergency');
        info('Emergency SOS', 'Accessing emergency services');
      }
    },
    {
      title: 'Scan Prescription',
      description: 'AI-powered prescription scanning',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        navigate('/prescription-scanner');
        info('Prescription Scanner', 'Starting AI prescription scanner');
      }
    },
    {
      title: 'Start AI Chat',
      description: 'Get medical advice instantly',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        navigate('/chat');
        info('AI Assistant', 'Starting conversation with medical AI');
      }
    },
    {
      title: 'Disease Predictor',
      description: 'Predict diseases from symptoms',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      action: () => {
        navigate('/disease-predictor');
        info('Disease Predictor', 'Predict diseases from your symptoms');
      }
    },
    {
      title: 'Log Mood',
      description: 'Track your mental health',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        navigate('/mental-health');
        info('Mental Health', 'Log your current mood');
      }
    }
  ];

  const advancedFeatures = [
    {
      icon: Cpu,
      title: "AI Health Insights",
      description: "Machine learning analyzes your health patterns",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description: "HIPAA-compliant encrypted health records",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Wifi,
      title: "Real-time Sync",
      description: "Seamless synchronization across devices",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Lock,
      title: "Privacy Protection",
      description: "End-to-end encryption for all data",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: Eye,
      title: "Visual Analytics",
      description: "Beautiful charts and health insights",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Hands-free health data entry",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Time to take your morning vitamins',
      time: '2 hours ago',
      icon: Clock,
      color: 'text-blue-500',
      action: () => {
        navigate('/medications');
        info('Medications', 'View your medication schedule');
      }
    },
    {
      id: 2,
      type: 'prescription',
      title: 'Prescription Scanned',
      description: 'New prescription from Dr. Smith processed',
      time: '1 day ago',
      icon: Scan,
      color: 'text-purple-500',
      action: () => {
        navigate('/prescription-scanner');
        info('Prescription Scanner', 'View your scanned prescriptions');
      }
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Dr. Smith - General Checkup',
      time: 'Tomorrow at 2:00 PM',
      icon: Calendar,
      color: 'text-green-500',
      action: () => {
        setShowAppointmentModal(true);
      }
    },
    {
      id: 4,
      type: 'health',
      title: 'Health Goal Achieved',
      description: 'You reached your daily step goal!',
      time: '4 hours ago',
      icon: Target,
      color: 'text-purple-500',
      action: () => {
        navigate('/health');
        success('Congratulations!', 'Great job on reaching your step goal!');
      }
    }
  ];

  const getLatestMood = () => {
    if (moodEntries.length === 0) return null;
    return moodEntries[moodEntries.length - 1];
  };

  const getUpcomingMedications = () => {
    const now = new Date();
    const today = now.toDateString();
    
    return medications
      .filter(med => !med.endDate || med.endDate > now)
      .flatMap(med => 
        med.time.map(time => ({
          medication: med,
          time,
          isPast: new Date(`${today} ${time}`) < now
        }))
      )
      .filter(dose => !dose.isPast)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 3);
  };

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const latestMood = getLatestMood();
  const upcomingMeds = getUpcomingMedications();

  // Animation variants
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
  const pulse = {
    animate: {
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 1.2 }
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced Hero Section */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <motion.div 
          animate={pulse.animate} 
          className="absolute top-0 right-0 w-16 h-16 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </motion.div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
              <p className="text-xl text-blue-100 mb-6">Your health journey continues here</p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => {
                    navigate('/health');
                    info('Health Score', 'View detailed health analytics');
                  }}
                  className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Health Score: 85%</span>
                </button>
                <button 
                  onClick={() => {
                    info('Goals', 'Goal tracking feature coming soon!');
                  }}
                  className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">3 Active Goals</span>
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <button 
                onClick={() => {
                  navigate('/health');
                  info('Analytics', 'View comprehensive health analytics');
                }}
                className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-float hover:bg-white/30 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-16 h-16 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Appointments Section */}
      {upcomingAppointments.length > 0 && (
        <motion.div 
          variants={itemVariants} 
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="card-enhanced p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Upcoming Appointments
          </h2>
          <ul className="space-y-3">
            {upcomingAppointments.map(app => (
              <li key={app.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{app.doctorName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{app.date instanceof Date ? app.date.toLocaleString() : new Date(app.date).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{app.location}</div>
                </div>
                <button className="btn-secondary text-xs" onClick={() => setShowAppointmentModal(true)}>
                  View
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Enhanced Stats Grid */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, index) => (
          <motion.button
            key={stat.label}
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            whileHover={{ scale: 1.08, rotateZ: 2 }}
            whileTap={{ scale: 0.97 }}
            className="card-enhanced p-6 hover-lift text-left w-full"
            onClick={stat.action}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-sm font-medium flex items-center ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.unit} • {stat.label}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            whileHover={{ scale: 1.12, rotateZ: 2 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative overflow-hidden bg-gradient-to-r ${action.color} text-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            onClick={action.action}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <action.icon className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Enhanced Features Grid */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.button
            key={feature.name}
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            whileHover={{ scale: 1.09, rotateX: 4, rotateY: 2 }}
            whileTap={{ scale: 0.97 }}
            className="group card-enhanced-interactive p-6 hover-lift text-left w-full"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={feature.action}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">
                  {feature.description}
                </p>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Advanced Features Section */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {advancedFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            whileHover={{ scale: 1.07, rotateZ: 2 }}
            className="card-enhanced p-6 hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Medications */}
        <motion.div variants={itemVariants} className="card-enhanced p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Next Medications
            </h3>
            <button 
              onClick={() => navigate('/medications')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {upcomingMeds.length === 0 ? (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming medications</p>
              <button 
                onClick={() => navigate('/medications')}
                className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
              >
                Add medications
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeds.map((dose, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {dose.medication.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {dose.medication.dosage}
                    </p>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {dose.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Mood */}
        <motion.div variants={itemVariants} className="card-enhanced p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Mental Health
            </h3>
            <button 
              onClick={() => navigate('/mental-health')}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
            >
              Track Mood
            </button>
          </div>
          
          {!latestMood ? (
            <div className="text-center py-4">
              <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No mood entries yet</p>
              <button 
                onClick={() => navigate('/mental-health')}
                className="text-purple-600 dark:text-purple-400 text-sm mt-2 hover:underline"
              >
                Log your mood
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                Feeling {latestMood.mood}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {latestMood.timestamp.toLocaleDateString()}
              </p>
            </div>
          )}
        </motion.div>

        {/* Health Summary */}
        <motion.div variants={itemVariants} className="card-enhanced p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Health Summary
            </h3>
            <button 
              onClick={() => navigate('/health')}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
            >
              View Details
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Symptoms Tracked</span>
              <span className="font-medium text-gray-900 dark:text-white">{symptoms.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Health Metrics</span>
              <span className="font-medium text-gray-900 dark:text-white">{healthMetrics.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Active Medications</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {medications.filter(med => !med.endDate || med.endDate > new Date()).length}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activities Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentActivities.map((activity) => (
          <motion.button
            key={activity.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
            onClick={activity.action}
          >
            <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Health Tips Section */}
      <motion.div variants={itemVariants} className="card-enhanced p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Health Tip</h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Stay Hydrated</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Drinking adequate water helps maintain your energy levels and supports overall health. 
                Aim for 8 glasses throughout the day.
              </p>
              <button 
                onClick={() => {
                  navigate('/health');
                  info('Hydration Tracking', 'Track your daily water intake in health metrics');
                }}
                className="text-green-600 dark:text-green-400 text-sm mt-2 hover:underline"
              >
                Track water intake →
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appointment Modal */}
      <AccessibleModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Manage Appointment"
      >
        <div className="space-y-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upcoming Appointment
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your upcoming appointment details
            </p>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              setShowAppointmentModal(false);
              success('Appointment Updated', 'Your appointment details have been updated.');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.doctorName}
                  onChange={e => setAppointment(a => ({ ...a, doctorName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Specialty</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.specialty}
                  onChange={e => setAppointment(a => ({ ...a, specialty: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.date}
                  onChange={e => setAppointment(a => ({ ...a, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.time}
                  onChange={e => setAppointment(a => ({ ...a, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.location}
                  onChange={e => setAppointment(a => ({ ...a, location: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={appointment.notes}
                  onChange={e => setAppointment(a => ({ ...a, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAppointmentModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setShowAppointmentModal(false);
                  success('Appointment Deleted', 'Your appointment has been deleted.');
                }}
              >
                Delete Appointment
              </button>
            </div>
          </form>
        </div>
      </AccessibleModal>
    </motion.div>
  );
}