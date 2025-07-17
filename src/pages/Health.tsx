import React from 'react';
import { useStore } from '../store';
import { 
  Activity, 
  Weight, 
  Heart, 
  Thermometer, 
  Droplet,
  Plus,
  TrendingUp,
  Calendar,
  AlertCircle,
  Moon,
  Ruler,
  Scale,
  Target,
  Award,
  Zap,
  Clock,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import type { HealthMetric } from '../types';
import { motion } from 'framer-motion';

function Health() {
  const healthMetrics = useStore((state) => state.healthMetrics);
  const addHealthMetric = useStore((state) => state.addHealthMetric);
  const { success, info, error } = useToast();
  
  const [showAddMetric, setShowAddMetric] = React.useState(false);
  const [showEditMetric, setShowEditMetric] = React.useState(false);
  const [editingMetric, setEditingMetric] = React.useState<HealthMetric | null>(null);
  const [selectedMetricType, setSelectedMetricType] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<string>('30');
  const [showGoalsModal, setShowGoalsModal] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  
  const [newMetric, setNewMetric] = React.useState<Partial<HealthMetric>>({
    type: 'weight',
    value: '',
    unit: 'kg',
    notes: '',
  });

  const [healthGoals, setHealthGoals] = React.useState([
    { id: 1, type: 'weight', target: 70, current: 75, unit: 'kg', deadline: '2024-06-01' },
    { id: 2, type: 'steps', target: 10000, current: 7500, unit: 'steps/day', deadline: '2024-12-31' },
    { id: 3, type: 'water', target: 8, current: 6, unit: 'glasses/day', deadline: '2024-12-31' },
  ]);

  // Change metricTypes to allow string for type
  const metricTypes: Array<{ type: string; icon: any; unit: string; label: string; range: string; description: string; color: string; normalRange: { min: number; max: number } }> = [
    { 
      type: 'weight', 
      icon: Weight, 
      unit: 'kg', 
      label: 'Weight',
      range: '45-100',
      description: 'Track your body weight',
      color: '#10B981',
      normalRange: { min: 50, max: 90 }
    },
    { 
      type: 'blood_pressure', 
      icon: Activity, 
      unit: 'mmHg', 
      label: 'Blood Pressure',
      range: '120/80',
      description: 'Monitor blood pressure',
      color: '#EF4444',
      normalRange: { min: 90, max: 140 }
    },
    { 
      type: 'heart_rate', 
      icon: Heart, 
      unit: 'bpm', 
      label: 'Heart Rate',
      range: '60-100',
      description: 'Track resting heart rate',
      color: '#EC4899',
      normalRange: { min: 60, max: 100 }
    },
    { 
      type: 'blood_sugar', 
      icon: Droplet, 
      unit: 'mg/dL', 
      label: 'Blood Sugar',
      range: 'Fasting: 70-100',
      description: 'Monitor glucose levels',
      color: '#8B5CF6',
      normalRange: { min: 70, max: 100 }
    },
    { 
      type: 'temperature', 
      icon: Thermometer, 
      unit: '°C', 
      label: 'Temperature',
      range: '36.5-37.5',
      description: 'Body temperature',
      color: '#F59E0B',
      normalRange: { min: 36.1, max: 37.2 }
    },
    {
      type: 'height',
      icon: Ruler,
      unit: 'cm',
      label: 'Height',
      range: '150-190',
      description: 'Track height changes',
      color: '#06B6D4',
      normalRange: { min: 140, max: 200 }
    },
    {
      type: 'bmi',
      icon: Scale,
      unit: 'kg/m²',
      label: 'BMI',
      range: '18.5-24.9',
      description: 'Body Mass Index',
      color: '#3B82F6',
      normalRange: { min: 18.5, max: 24.9 }
    },
    {
      type: 'sleep',
      icon: Moon,
      unit: 'hours',
      label: 'Sleep Duration',
      range: '7-9',
      description: 'Daily sleep tracking',
      color: '#6366F1',
      normalRange: { min: 7, max: 9 }
    },
    {
      type: 'steps',
      icon: Activity,
      unit: 'steps',
      label: 'Daily Steps',
      range: '8000-12000',
      description: 'Track daily activity',
      color: '#22C55E',
      normalRange: { min: 8000, max: 15000 }
    },
    {
      type: 'water',
      icon: Droplet,
      unit: 'glasses',
      label: 'Water Intake',
      range: '6-8',
      description: 'Daily hydration',
      color: '#0EA5E9',
      normalRange: { min: 6, max: 10 }
    }
  ];

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const validateMetricValue = (type: string, value: number): boolean => {
    const metricType = metricTypes.find(m => m.type === type);
    if (!metricType) return false;
    
    const { min, max } = metricType.normalRange;
    return value >= min * 0.5 && value <= max * 2; // Allow wider range for input validation
  };

  const getMetricStatus = (type: string, value: number): 'good' | 'warning' | 'critical' => {
    const metricType = metricTypes.find(m => m.type === type);
    if (!metricType) return 'good';
    
    const { min, max } = metricType.normalRange;
    if (value >= min && value <= max) return 'good';
    if (value >= min * 0.8 && value <= max * 1.2) return 'warning';
    return 'critical';
  };

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetric.value) {
      error('Validation Error', 'Please enter a value');
      return;
    }

    const numericValue = typeof newMetric.value === 'string' ? 
      parseFloat(newMetric.value) : newMetric.value;

    if (!validateMetricValue(newMetric.type!, numericValue)) {
      error('Invalid Value', 'Please enter a realistic value for this metric');
      return;
    }

    // Auto-calculate BMI if height and weight are available
    if (newMetric.type === 'weight' || newMetric.type === 'height') {
      const latestHeight = newMetric.type === 'height' ? numericValue : 
        getLatestMetricValue('height');
      const latestWeight = newMetric.type === 'weight' ? numericValue :
        getLatestMetricValue('weight');

      if (latestHeight && latestWeight && latestHeight > 0) {
        const bmi = calculateBMI(latestWeight, latestHeight);
        const bmiMetric: HealthMetric = {
          id: Date.now().toString() + '-bmi',
          type: 'bmi',
          value: bmi,
          unit: 'kg/m²',
          timestamp: new Date(),
          category: getMetricStatus('bmi', bmi)
        };
        addHealthMetric(bmiMetric);
        info('BMI Calculated', `Your BMI is ${bmi} (${getBMICategory(bmi)})`);
      }
    }

    const metric: HealthMetric = {
      id: Date.now().toString(),
      type: newMetric.type!,
      value: numericValue,
      unit: newMetric.unit!,
      timestamp: new Date(),
      notes: newMetric.notes,
      category: getMetricStatus(newMetric.type!, numericValue)
    };

    addHealthMetric(metric);
    setShowAddMetric(false);
    resetForm();
    success('Metric Added', `${metricTypes.find(m => m.type === metric.type)?.label} recorded successfully`);
  };

  const handleEditMetric = (metric: HealthMetric) => {
    setEditingMetric(metric);
    setNewMetric({
      type: metric.type,
      value: metric.value.toString(),
      unit: metric.unit,
      notes: metric.notes,
    });
    setShowEditMetric(true);
  };

  const handleUpdateMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric) return;

    // In a real app, you'd update the metric in the store
    setShowEditMetric(false);
    setEditingMetric(null);
    resetForm();
    success('Metric Updated', 'Your health metric has been updated successfully');
  };

  const handleDeleteMetric = (metricId: string, metricType: string) => {
    const metricLabel = metricTypes.find(m => m.type === metricType)?.label;
    if (window.confirm(`Are you sure you want to delete this ${metricLabel} entry?`)) {
      // In a real app, you'd remove from store
      success('Metric Deleted', `${metricLabel} entry has been removed`);
    }
  };

  const resetForm = () => {
    setNewMetric({
      type: 'weight',
      value: '',
      unit: 'kg',
      notes: '',
    });
  };

  const getMetricData = (type: string) => {
    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return healthMetrics
      .filter((metric) => metric.type === type && metric.timestamp >= cutoffDate)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map((metric) => ({
        date: metric.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value,
        timestamp: metric.timestamp,
        category: metric.category
      }));
  };

  const getLatestMetric = (type: string) => {
    return healthMetrics
      .filter((metric) => metric.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  };

  const getLatestMetricValue = (type: string): number | null => {
    const metric = getLatestMetric(type);
    if (!metric) return null;
    return typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value;
  };

  const getChartColor = (metricType: string) => {
    const type = metricTypes.find(t => t.type === metricType);
    return type?.color || '#6B7280';
  };

  const getMetricTrends = () => {
    const trends: { [key: string]: { current: number; previous: number; change: number } } = {};
    
    metricTypes.forEach(type => {
      const data = getMetricData(type.type);
      if (data.length >= 2) {
        const current = data[data.length - 1].value;
        const previous = data[data.length - 2].value;
        const change = ((current - previous) / previous) * 100;
        trends[type.type] = { current, previous, change };
      }
    });
    
    return trends;
  };

  const exportHealthData = () => {
    const data = healthMetrics.map(metric => ({
      date: metric.timestamp.toISOString().split('T')[0],
      time: metric.timestamp.toTimeString().split(' ')[0],
      type: metric.type,
      value: metric.value,
      unit: metric.unit,
      notes: metric.notes || '',
      category: metric.category || ''
    }));

    const csvContent = [
      ['Date', 'Time', 'Type', 'Value', 'Unit', 'Notes', 'Category'].join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    success('Data Exported', 'Your health data has been downloaded as CSV');
  };

  const filteredMetrics = healthMetrics.filter(metric => {
    if (selectedMetricType === 'all') return true;
    return metric.type === selectedMetricType;
  });

  const trends = getMetricTrends();

  const getHealthScore = (): number => {
    const recentMetrics = metricTypes.map(type => getLatestMetric(type.type)).filter(Boolean);
    if (recentMetrics.length === 0) return 0;
    
    const scores = recentMetrics.map(metric => {
      if (metric.category === 'good') return 100;
      if (metric.category === 'warning') return 70;
      return 40;
    });
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const healthScore = getHealthScore();

  // Fix: Use string for type in goalForm and healthGoals, and ensure id is always number in saved goals
  const [goalForm, setGoalForm] = React.useState({
    id: null as number | null,
    type: '',
    target: '',
    current: '',
    unit: '',
    deadline: '',
  });
  const [isEditingGoal, setIsEditingGoal] = React.useState(false);

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
    <motion.div
      className="max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health Overview</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track and monitor your health metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowGoalsModal(true)}
            className="btn-secondary"
          >
            <Target className="w-4 h-4 mr-2" />
            Goals
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddMetric(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Measurement
          </button>
        </div>
      </div>
      </motion.div>

      {/* Health Score Dashboard */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Health Score</h2>
            <p className="text-blue-100">Based on your recent health metrics</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl font-bold">{healthScore}</span>
            </div>
            <p className="text-sm text-blue-100">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </p>
          </div>
        </div>
      </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['weight', 'heart_rate', 'blood_pressure', 'sleep'].map((type) => {
          const metricType = metricTypes.find(m => m.type === type);
          const latestMetric = getLatestMetric(type);
          const trend = trends[type];
          
          if (!metricType) return null;
          
          return (
              <motion.div key={type} variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
                <div className="card-enhanced p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-opacity-20`} style={{ backgroundColor: metricType.color + '20' }}>
                  <metricType.icon className="w-6 h-6" style={{ color: metricType.color }} />
                </div>
                {trend && (
                  <div className={`text-sm font-medium flex items-center ${
                    trend.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${trend.change < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(trend.change).toFixed(1)}%
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {latestMetric ? latestMetric.value : '--'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metricType.unit} • {metricType.label}
                </p>
                {latestMetric && (
                  <p className="text-xs text-gray-400 mt-1">
                    {latestMetric.timestamp.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
              </motion.div>
          );
        })}
      </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="form-label">Metric Type</label>
            <select
              value={selectedMetricType}
              onChange={(e) => setSelectedMetricType(e.target.value)}
              className="select-enhanced"
            >
              <option value="all">All Metrics</option>
              {metricTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Time Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="select-enhanced"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {metricTypes.map((metricType) => {
          if (selectedMetricType !== 'all' && selectedMetricType !== metricType.type) {
            return null;
          }
          
          const latestMetric = getLatestMetric(metricType.type);
          const metricData = getMetricData(metricType.type);
          const chartColor = getChartColor(metricType.type);
          
          return (
              <motion.div key={metricType.type} variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
                <div className="card-enhanced p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: chartColor + '20' }}>
                    <metricType.icon className="h-6 w-6" style={{ color: chartColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {metricType.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Normal: {metricType.range}
                    </p>
                  </div>
                </div>
                
                {latestMetric && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditMetric(latestMetric)}
                      className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMetric(latestMetric.id, latestMetric.type)}
                      className="btn-icon text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {latestMetric ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {latestMetric.value}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{latestMetric.unit}</span>
                      {latestMetric.category && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          latestMetric.category === 'good' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : latestMetric.category === 'warning'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {latestMetric.category}
                        </span>
                      )}
                    </div>
                    
                    {metricType.type === 'bmi' && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {getBMICategory(Number(latestMetric.value))}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {latestMetric.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {metricData.length > 1 && (
                    <div className="h-32 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metricData}>
                          <defs>
                            <linearGradient id={`gradient-${metricType.type}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                              <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date"
                            stroke="#6B7280"
                            fontSize={10}
                            tickMargin={5}
                          />
                          <YAxis
                            stroke="#6B7280"
                            fontSize={10}
                            tickMargin={5}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: 'none',
                              borderRadius: '0.5rem',
                              color: '#F3F4F6'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            fill={`url(#gradient-${metricType.type})`}
                            strokeWidth={2}
                            dot={{ fill: chartColor, r: 4 }}
                            activeDot={{ r: 6, fill: chartColor }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {latestMetric.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {latestMetric.notes}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <metricType.icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No data recorded</p>
                  <button
                    onClick={() => {
                      setNewMetric({ ...newMetric, type: metricType.type, unit: metricType.unit });
                      setShowAddMetric(true);
                    }}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {metricType.label}
                  </button>
                </div>
              )}
            </div>
              </motion.div>
          );
        })}
      </div>
      </motion.div>

      {/* Add Metric Modal */}
      <AccessibleModal
        isOpen={showAddMetric}
        onClose={() => setShowAddMetric(false)}
        title="Add New Measurement"
        size="lg"
      >
        <form onSubmit={handleAddMetric} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Measurement Type</label>
              <select
                value={newMetric.type}
                onChange={(e) => {
                  const selectedType = metricTypes.find(t => t.type === e.target.value);
                  setNewMetric({ 
                    ...newMetric, 
                    type: e.target.value,
                    unit: selectedType?.unit || 'kg'
                  });
                }}
                className="select-enhanced"
              >
                {metricTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="form-help">
                Normal range: {metricTypes.find(t => t.type === newMetric.type)?.range}
              </p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Value</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                  className="input-enhanced pr-16"
                  placeholder={`Enter ${metricTypes.find(t => t.type === newMetric.type)?.label.toLowerCase()}`}
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  {newMetric.unit}
                </span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={newMetric.notes}
              onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
              className="textarea-enhanced"
              rows={3}
              placeholder="Add any additional notes about this measurement"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowAddMetric(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Measurement
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Edit Metric Modal */}
      <AccessibleModal
        isOpen={showEditMetric}
        onClose={() => setShowEditMetric(false)}
        title="Edit Measurement"
        size="lg"
      >
        <form onSubmit={handleUpdateMetric} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Measurement Type</label>
              <select
                value={newMetric.type}
                onChange={(e) => {
                  const selectedType = metricTypes.find(t => t.type === e.target.value);
                  setNewMetric({ 
                    ...newMetric, 
                    type: e.target.value,
                    unit: selectedType?.unit || 'kg'
                  });
                }}
                className="select-enhanced"
                disabled
              >
                {metricTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Value</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                  className="input-enhanced pr-16"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  {newMetric.unit}
                </span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={newMetric.notes}
              onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
              className="textarea-enhanced"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowEditMetric(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Measurement
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Goals Modal */}
      <AccessibleModal
        isOpen={showGoalsModal}
        onClose={() => {
          setShowGoalsModal(false);
          setGoalForm({ id: null, type: '', target: '', current: '', unit: '', deadline: '' });
          setIsEditingGoal(false);
        }}
        title="Health Goals"
        size="xl"
      >
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="space-y-6">
          <div className="text-center">
            <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Health Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track your progress towards better health
            </p>
          </div>
            {/* Add/Edit Goal Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!goalForm.type || !goalForm.target || !goalForm.current || !goalForm.unit || !goalForm.deadline) {
                  error('Validation Error', 'Please fill all fields');
                  return;
                }
                if (isEditingGoal && goalForm.id !== null) {
                  setHealthGoals(goals => goals.map(g => g.id === goalForm.id ? { ...goalForm, id: goalForm.id as number, type: goalForm.type, target: Number(goalForm.target), current: Number(goalForm.current), unit: goalForm.unit, deadline: goalForm.deadline } : g));
                  success('Goal Updated', 'Health goal updated successfully.');
                } else {
                  setHealthGoals(goals => [
                    ...goals,
                    {
                      id: Date.now(),
                      type: goalForm.type,
                      target: Number(goalForm.target),
                      current: Number(goalForm.current),
                      unit: goalForm.unit,
                      deadline: goalForm.deadline
                    }
                  ]);
                  success('Goal Added', 'New health goal added.');
                }
                setGoalForm({ id: null, type: '', target: '', current: '', unit: '', deadline: '' });
                setIsEditingGoal(false);
              }}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mb-6"
            >
              <div>
                <label className="form-label">Type</label>
                <select
                  className="select-enhanced"
                  value={goalForm.type}
                  onChange={e => setGoalForm(f => ({ ...f, type: e.target.value }))}
                >
                  {metricTypes.map(m => (
                    <option key={m.type} value={m.type}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Target</label>
                <input
                  type="number"
                  className="input-enhanced"
                  value={goalForm.target}
                  onChange={e => setGoalForm(f => ({ ...f, target: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Current</label>
                <input
                  type="number"
                  className="input-enhanced"
                  value={goalForm.current}
                  onChange={e => setGoalForm(f => ({ ...f, current: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Unit</label>
                <input
                  type="text"
                  className="input-enhanced"
                  value={goalForm.unit}
                  onChange={e => setGoalForm(f => ({ ...f, unit: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="input-enhanced"
                  value={goalForm.deadline}
                  onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))}
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn-primary w-full">
                  {isEditingGoal ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </form>
            {/* Goals List */}
          <div className="space-y-4">
            {healthGoals.map((goal) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const isCompleted = goal.current >= goal.target;
              return (
                  <motion.div key={goal.id} variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {goal.type} Goal
                    </h4>
                        <div className="flex gap-2">
                          <button
                            className="btn-icon text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={() => {
                              setGoalForm({ ...goal, target: String(goal.target), current: String(goal.current) });
                              setIsEditingGoal(true);
                            }}
                            title="Edit Goal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="btn-icon text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            onClick={() => {
                              setHealthGoals(goals => goals.filter(g => g.id !== goal.id));
                              success('Goal Deleted', 'Health goal deleted.');
                            }}
                            title="Delete Goal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                    {isCompleted && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                      </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Target date: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                  </motion.div>
              );
            })}
          </div>
          </div>
        </motion.div>
      </AccessibleModal>

      {/* Export Modal */}
      <AccessibleModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Health Data"
      >
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="space-y-6">
          <div className="text-center">
            <Download className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Export Your Health Data
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Download your health metrics for backup or sharing with healthcare providers
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export includes:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• All recorded health metrics</li>
              <li>• Timestamps and notes</li>
              <li>• CSV format for easy import</li>
              <li>• {healthMetrics.length} total measurements</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                exportHealthData();
                setShowExportModal(false);
              }}
              className="flex-1 btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </button>
            <button
              onClick={() => setShowExportModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
        </motion.div>
      </AccessibleModal>

      {/* Health Tips */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Indian Health Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">Diet Recommendations</h3>
            <p className="text-green-600 dark:text-green-300 text-sm">
              Follow a balanced diet with dal, roti, sabzi, and curd. Include seasonal fruits and vegetables.
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Hydration</h3>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              Drink 3-4 liters of water daily, especially in hot climate. Include coconut water and buttermilk.
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <h3 className="font-medium text-purple-800 dark:text-purple-400 mb-2">Exercise</h3>
            <p className="text-purple-600 dark:text-purple-300 text-sm">
              Include yoga, pranayama, and 30 minutes of daily walking. Traditional exercises like surya namaskara.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Seasonal Care</h3>
            <p className="text-yellow-600 dark:text-yellow-300 text-sm">
              Adjust diet and activity based on seasonal changes. Follow Ayurvedic principles for better health.
            </p>
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

export default Health;