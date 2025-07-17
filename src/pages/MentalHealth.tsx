import React from 'react';
import { useStore } from '../store';
import { 
  Brain, 
  Sun, 
  Moon, 
  CloudRain, 
  CloudLightning,
  Heart,
  Smile,
  Frown,
  Meh,
  Calendar,
  TrendingUp,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { MoodEntry } from '../types';

export default function MentalHealth() {
  const moodEntries = useStore((state) => state.moodEntries);
  const addMoodEntry = useStore((state) => state.addMoodEntry);
  const { success, info } = useToast();
  
  const [currentMood, setCurrentMood] = React.useState<string>('');
  const [note, setNote] = React.useState('');
  const [selectedExercise, setSelectedExercise] = React.useState<string | null>(null);
  const [isBreathingActive, setIsBreathingActive] = React.useState(false);
  const [breathingPhase, setBreathingPhase] = React.useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = React.useState(0);
  const [meditationTimer, setMeditationTimer] = React.useState(0);
  const [isMeditating, setIsMeditating] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [selectedMeditationDuration, setSelectedMeditationDuration] = React.useState(5);

  const moods = [
    { 
      icon: Sun, 
      label: 'Excellent', 
      value: 'excellent',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Feeling amazing and energetic'
    },
    { 
      icon: Smile, 
      label: 'Good', 
      value: 'good',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Feeling positive and content'
    },
    { 
      icon: Meh, 
      label: 'Neutral', 
      value: 'neutral',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Feeling okay, neither good nor bad'
    },
    { 
      icon: Frown, 
      label: 'Low', 
      value: 'low',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      description: 'Feeling down or unmotivated'
    },
    { 
      icon: CloudRain, 
      label: 'Sad', 
      value: 'sad',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      description: 'Feeling sad or melancholic'
    },
    { 
      icon: CloudLightning, 
      label: 'Anxious', 
      value: 'anxious',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      description: 'Feeling worried or stressed'
    },
  ];

  const breathingExercises = [
    {
      id: 'box',
      name: '4-4-4-4 Box Breathing',
      description: 'Inhale for 4, hold for 4, exhale for 4, hold for 4',
      duration: [4, 4, 4, 4],
      benefits: 'Reduces stress and improves focus'
    },
    {
      id: 'triangle',
      name: '4-7-8 Relaxing Breath',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      duration: [4, 7, 8],
      benefits: 'Promotes relaxation and better sleep'
    },
    {
      id: 'simple',
      name: 'Simple Deep Breathing',
      description: 'Inhale for 4, exhale for 6',
      duration: [4, 0, 6],
      benefits: 'Quick stress relief and centering'
    }
  ];

  const wellnessTips = [
    {
      title: 'Practice Gratitude',
      description: 'Write down 3 things you\'re grateful for each day',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      title: 'Stay Connected',
      description: 'Reach out to friends and family regularly',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Get Moving',
      description: 'Even 10 minutes of exercise can boost your mood',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Mindful Moments',
      description: 'Take short breaks to practice mindfulness',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  // Breathing exercise timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathingActive && selectedExercise) {
      const exercise = breathingExercises.find(ex => ex.id === selectedExercise);
      if (!exercise) return;

      interval = setInterval(() => {
        setBreathingCount(prev => {
          const phases = ['inhale', 'hold', 'exhale', 'hold'].slice(0, exercise.duration.length);
          const currentPhaseIndex = prev % phases.length;
          const nextPhaseIndex = (prev + 1) % phases.length;
          
          setBreathingPhase(phases[nextPhaseIndex] as any);
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathingActive, selectedExercise]);

  // Meditation timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTimer(prev => {
          if (prev >= selectedMeditationDuration * 60) {
            setIsMeditating(false);
            success('Meditation Complete', 'Great job! You completed your meditation session.');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMeditating, selectedMeditationDuration, success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMood) {
      info('Select Mood', 'Please select how you\'re feeling today');
      return;
    }

    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentMood as any,
      note,
      timestamp: new Date(),
    };

    addMoodEntry(moodEntry);
    success('Mood Logged', 'Your mood has been recorded successfully');
    setCurrentMood('');
    setNote('');
  };

  const startBreathingExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setIsBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    info('Exercise Started', 'Follow the breathing pattern on screen');
  };

  const stopBreathingExercise = () => {
    setIsBreathingActive(false);
    setSelectedExercise(null);
    setBreathingCount(0);
    success('Exercise Complete', 'Great job on completing the breathing exercise!');
  };

  const startMeditation = () => {
    setIsMeditating(true);
    setMeditationTimer(0);
    info('Meditation Started', `Starting ${selectedMeditationDuration} minute meditation session`);
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    setMeditationTimer(0);
    info('Meditation Stopped', 'Meditation session ended');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodChartData = () => {
    const moodValues = {
      excellent: 5,
      good: 4,
      neutral: 3,
      low: 2,
      sad: 1,
      anxious: 1
    };

    return moodEntries
      .slice(-14) // Last 14 entries
      .map(entry => ({
        date: entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: moodValues[entry.mood as keyof typeof moodValues] || 3,
        label: entry.mood
      }));
  };

  const getSelectedMood = () => moods.find(mood => mood.value === currentMood);
  const selectedMoodData = getSelectedMood();

  const getCurrentBreathingInstruction = () => {
    if (!selectedExercise || !isBreathingActive) return '';
    
    const exercise = breathingExercises.find(ex => ex.id === selectedExercise);
    if (!exercise) return '';

    const phases = ['inhale', 'hold', 'exhale', 'hold'].slice(0, exercise.duration.length);
    const currentPhaseIndex = breathingCount % phases.length;
    const currentDuration = exercise.duration[currentPhaseIndex];
    const timeInPhase = (breathingCount % exercise.duration.reduce((a, b) => a + b, 0)) % currentDuration;
    
    return `${phases[currentPhaseIndex].charAt(0).toUpperCase() + phases[currentPhaseIndex].slice(1)} (${currentDuration - timeInPhase}s)`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mental Health Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor your mental wellbeing and practice mindfulness
        </p>
      </div>

      {/* Mood Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
          How are you feeling today?
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = currentMood === mood.value;
              
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setCurrentMood(mood.value)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? `${mood.borderColor} ${mood.bgColor} shadow-lg`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-10 h-10 mx-auto mb-3 ${mood.color}`} />
                  <span className="block text-sm font-medium text-center text-gray-900 dark:text-white mb-1">
                    {mood.label}
                  </span>
                  <span className="block text-xs text-center text-gray-500 dark:text-gray-400">
                    {mood.description}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedMoodData && (
            <div className={`p-4 rounded-xl ${selectedMoodData.bgColor} border ${selectedMoodData.borderColor}`}>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You selected: <strong>{selectedMoodData.label}</strong> - {selectedMoodData.description}
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Add a note about your mood (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea-enhanced"
              rows={4}
              placeholder="What's contributing to how you feel today? Any thoughts or experiences you'd like to record?"
            />
          </div>
          
          <button
            type="submit"
            disabled={!currentMood}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="w-4 h-4 mr-2" />
            Log My Mood
          </button>
        </form>
      </div>

      {/* Mood Chart */}
      {moodEntries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Mood Trends
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getMoodChartData()}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    const labels = ['', 'Low', 'Sad', 'Neutral', 'Good', 'Excellent'];
                    return labels[value] || '';
                  }}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    props.payload.label, 'Mood'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#8B5CF6"
                  fill="url(#moodGradient)"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Breathing Exercises */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <Activity className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
          Breathing Exercises
        </h2>
        
        {!isBreathingActive ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breathingExercises.map((exercise) => (
              <div key={exercise.id} className="card-enhanced p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {exercise.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Benefits: {exercise.benefits}
                </p>
                <button
                  onClick={() => startBreathingExercise(exercise.id)}
                  className="btn-primary w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Exercise
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto relative">
              <div className={`w-full h-full rounded-full border-4 transition-all duration-1000 ${
                breathingPhase === 'inhale' ? 'scale-110 border-blue-500 bg-blue-100 dark:bg-blue-900/30' :
                breathingPhase === 'hold' ? 'scale-110 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' :
                'scale-90 border-green-500 bg-green-100 dark:bg-green-900/30'
              }`}>
                <div className="flex items-center justify-center h-full">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getCurrentBreathingInstruction()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {breathingExercises.find(ex => ex.id === selectedExercise)?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow the circle and breathe with the rhythm
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={stopBreathingExercise}
                  className="btn-secondary"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Exercise
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="btn-icon text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meditation Timer */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <Timer className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Meditation Timer
        </h2>
        
        <div className="text-center space-y-6">
          {!isMeditating ? (
            <>
              <div className="space-y-4">
                <label className="form-label">Select Duration</label>
                <div className="flex justify-center space-x-4">
                  {[5, 10, 15, 20, 30].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedMeditationDuration(duration)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedMeditationDuration === duration
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={startMeditation}
                className="btn-primary"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Meditation ({selectedMeditationDuration} minutes)
              </button>
            </>
          ) : (
            <>
              <div className="w-48 h-48 mx-auto relative">
                <div className="w-full h-full rounded-full border-8 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatTime(selectedMeditationDuration * 60 - meditationTimer)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      remaining
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Focus on your breath and let your thoughts pass by like clouds
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={stopMeditation}
                    className="btn-secondary"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Meditation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400" />
          Daily Wellness Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className={`p-6 rounded-xl ${tip.bgColor} border border-gray-200 dark:border-gray-700`}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Icon className={`w-6 h-6 ${tip.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Mood Entries */}
      {moodEntries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Recent Entries
          </h2>
          
          <div className="space-y-4">
            {moodEntries
              .slice(-5)
              .reverse()
              .map((entry) => {
                const mood = moods.find(m => m.value === entry.mood);
                if (!mood) return null;
                
                const Icon = mood.icon;
                
                return (
                  <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className={`p-2 rounded-lg ${mood.bgColor}`}>
                      <Icon className={`w-5 h-5 ${mood.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {mood.label}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}