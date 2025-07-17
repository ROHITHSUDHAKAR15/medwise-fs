import React from 'react';
import { useStore } from '../store';
import { 
  Clock, 
  Plus, 
  Bell, 
  Calendar, 
  Pill,
  AlertCircle,
  Check,
  X,
  Edit,
  Trash2,
  Camera,
  Upload,
  Search,
  Filter,
  ChevronDown,
  Timer,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import type { Medication } from '../types';
import type { Appointment } from '../types';
import { motion } from 'framer-motion';

export default function Medications() {
  const medications = useStore((state) => state.medications);
  const addMedication = useStore((state) => state.addMedication);
  const addAppointment = useStore((state) => state.addAppointment);
  const { success, error, info } = useToast();
  
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = React.useState(false);
  const [editingMedication, setEditingMedication] = React.useState<Medication | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'completed'>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = React.useState(false);
  const [appointment, setAppointment] = React.useState({
    doctorName: '',
    date: '',
    time: '',
    notes: '',
  });
  const [remindAppointment, setRemindAppointment] = React.useState(true);
  const [showManageModal, setShowManageModal] = React.useState(false);
  const [editingAppointment, setEditingAppointment] = React.useState<Appointment | null>(null);
  const updateAppointment = useStore((state) => state.updateAppointment);
  const deleteAppointment = useStore((state) => state.deleteAppointment);
  
  const [newMedication, setNewMedication] = React.useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: 'once_daily',
    time: ['09:00'],
    startDate: new Date(),
    notes: '',
    refillReminder: true,
    remainingDoses: 30,
    duration: 30,
  });

  const frequencyOptions = [
    { value: 'once_daily', label: 'Once Daily', times: 1 },
    { value: 'twice_daily', label: 'Twice Daily', times: 2 },
    { value: 'three_times_daily', label: 'Three Times Daily', times: 3 },
    { value: 'four_times_daily', label: 'Four Times Daily', times: 4 },
    { value: 'as_needed', label: 'As Needed', times: 1 },
    { value: 'weekly', label: 'Weekly', times: 1 },
  ];

  const commonMedications = [
    'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Metformin',
    'Lisinopril', 'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Levothyroxine'
  ];

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMedication.name || !newMedication.dosage) {
      error('Validation Error', 'Please fill in all required fields');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency!,
      time: newMedication.time!,
      startDate: newMedication.startDate!,
      endDate: newMedication.duration ? 
        new Date(newMedication.startDate!.getTime() + newMedication.duration * 24 * 60 * 60 * 1000) : 
        undefined,
      notes: newMedication.notes,
      refillReminder: newMedication.refillReminder,
      remainingDoses: newMedication.remainingDoses!,
      duration: newMedication.duration!,
    };

    addMedication(medication);
    setShowAddModal(false);
    resetForm();
    success('Medication Added', `${medication.name} has been added to your medication list`);
    
    // Schedule notification reminder
    scheduleNotification(medication);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setNewMedication({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      startDate: medication.startDate,
      notes: medication.notes,
      refillReminder: medication.refillReminder,
      remainingDoses: medication.remainingDoses,
      duration: medication.duration,
    });
    setShowEditModal(true);
  };

  const handleUpdateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedication) return;

    // In a real app, you'd update the medication in the store
    setShowEditModal(false);
    setEditingMedication(null);
    resetForm();
    success('Medication Updated', 'Your medication has been updated successfully');
  };

  const handleDeleteMedication = (medicationId: string, medicationName: string) => {
    if (window.confirm(`Are you sure you want to delete ${medicationName}?`)) {
      // In a real app, you'd remove from store
      success('Medication Deleted', `${medicationName} has been removed from your list`);
    }
  };

  const handleTakeMedication = (medication: Medication) => {
    // In a real app, you'd update the medication status
    success('Medication Taken', `Marked ${medication.name} as taken`);
    info('Next Dose', `Next dose scheduled for ${getNextDoseTime(medication)}`);
  };

  const handleSkipMedication = (medication: Medication) => {
    info('Dose Skipped', `Skipped dose of ${medication.name}`);
  };

  const scheduleNotification = (medication: Medication) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      medication.time.forEach((time) => {
        // In a real app, you'd use a proper scheduling system
        info('Reminder Set', `Reminder set for ${medication.name} at ${time}`);
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          info('Notifications Enabled', 'You will receive medication reminders');
        }
      });
    }
  };

  const getNextDoseTime = (medication: Medication): string => {
    const now = new Date();
    const today = now.toDateString();
    
    for (const time of medication.time) {
      const [hours, minutes] = time.split(':').map(Number);
      const doseTime = new Date();
      doseTime.setHours(hours, minutes, 0, 0);
      
      if (doseTime > now) {
        return doseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    
    // If all doses for today are past, return first dose of tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = medication.time[0].split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);
    return `Tomorrow at ${tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const resetForm = () => {
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'once_daily',
      time: ['09:00'],
      startDate: new Date(),
      notes: '',
      refillReminder: true,
      remainingDoses: 30,
      duration: 30,
    });
  };

  const updateTimeSlots = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency);
    if (!option) return;

    const times: string[] = [];
    const baseHour = 9; // Start at 9 AM
    const interval = Math.floor(12 / option.times); // Distribute over 12 hours

    for (let i = 0; i < option.times; i++) {
      const hour = baseHour + (i * interval);
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    setNewMedication(prev => ({ ...prev, time: times }));
  };

  const filteredMedications = medications.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const isActive = !medication.endDate || medication.endDate > now;
    
    if (filterStatus === 'active') return matchesSearch && isActive;
    if (filterStatus === 'completed') return matchesSearch && !isActive;
    return matchesSearch;
  });

  const todaysMedications = medications.filter(medication => {
    const now = new Date();
    return !medication.endDate || medication.endDate > now;
  });

  const upcomingDoses = todaysMedications.flatMap(medication => 
    medication.time.map(time => ({
      medication,
      time,
      isPast: new Date(`${new Date().toDateString()} ${time}`) < new Date()
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  const appointments = useStore((state) => state.appointments);

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
      {/* Header */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medications</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your medications and never miss a dose
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            variants={itemVariants}
            animate={pulse.animate}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            className="btn-secondary"
            onClick={() => setShowPrescriptionModal(true)}
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Prescription
          </motion.button>
          <motion.button
            variants={itemVariants}
            animate={pulse.animate}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-enhanced pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2">
                    {[
                      { value: 'all', label: 'All Medications' },
                      { value: 'active', label: 'Active' },
                      { value: 'completed', label: 'Completed' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterStatus(option.value as any);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterStatus === option.value
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Timer className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Today's Schedule
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {upcomingDoses.filter(d => !d.isPast).length} doses remaining
          </span>
        </div>
        
        {upcomingDoses.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No medications scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingDoses.map((dose, index) => (
              <div
                key={`${dose.medication.id}-${dose.time}`}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  dose.isPast
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    dose.isPast
                      ? 'bg-gray-200 dark:bg-gray-600'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <Pill className={`w-6 h-6 ${
                      dose.isPast
                        ? 'text-gray-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {dose.medication.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {dose.medication.dosage} • {dose.time}
                    </p>
                  </div>
                </div>
                
                {!dose.isPast && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSkipMedication(dose.medication)}
                      className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Skip dose"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleTakeMedication(dose.medication)}
                      className="btn-icon text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                      title="Mark as taken"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Medications List */}
      <motion.div 
        variants={itemVariants} 
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          All Medications ({filteredMedications.length})
        </h2>
        
        {filteredMedications.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No medications found' : 'No medications added yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Add your first medication to get started with tracking'
              }
            </p>
            {!searchTerm && (
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Medication
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedications.map((medication) => {
              const isActive = !medication.endDate || medication.endDate > new Date();
              const daysRemaining = medication.endDate 
                ? Math.ceil((medication.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null;
              
              return (
                <div
                  key={medication.id}
                  className="card-enhanced p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Pill className={`w-6 h-6 ${
                          isActive 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {medication.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {medication.dosage}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditMedication(medication)}
                        className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(medication.id, medication.name)}
                        className="btn-icon text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Frequency</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {frequencyOptions.find(opt => opt.value === medication.frequency)?.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Times</span>
                      <div className="flex space-x-1">
                        {medication.time.map((time, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {medication.remainingDoses && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                        <span className={`font-medium ${
                          medication.remainingDoses < 5 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {medication.remainingDoses} doses
                        </span>
                      </div>
                    )}
                    
                    {daysRemaining !== null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Duration</span>
                        <span className={`font-medium ${
                          daysRemaining < 3 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {medication.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {medication.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {medication.refillReminder && (
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                          <Bell className="w-3 h-3 mr-1" />
                          Refill alerts on
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add Medication Modal */}
      <AccessibleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Medication"
        size="lg"
      >
        <form onSubmit={handleAddMedication} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Medication Name *</label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                className="input-enhanced"
                placeholder="Enter medication name"
                list="common-medications"
                required
              />
              <datalist id="common-medications">
                {commonMedications.map((med) => (
                  <option key={med} value={med} />
                ))}
              </datalist>
            </div>
            
            <div className="form-group">
              <label className="form-label">Dosage *</label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                className="input-enhanced"
                placeholder="e.g., 500mg, 1 tablet"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Frequency *</label>
              <select
                value={newMedication.frequency}
                onChange={(e) => {
                  setNewMedication({ ...newMedication, frequency: e.target.value });
                  updateTimeSlots(e.target.value);
                }}
                className="select-enhanced"
                required
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={newMedication.startDate?.toISOString().split('T')[0]}
                onChange={(e) => setNewMedication({ 
                  ...newMedication, 
                  startDate: new Date(e.target.value) 
                })}
                className="input-enhanced"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration (days)</label>
              <input
                type="number"
                value={newMedication.duration}
                onChange={(e) => setNewMedication({ 
                  ...newMedication, 
                  duration: parseInt(e.target.value) || 0 
                })}
                className="input-enhanced"
                min="1"
                placeholder="30"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Remaining Doses</label>
              <input
                type="number"
                value={newMedication.remainingDoses}
                onChange={(e) => setNewMedication({ 
                  ...newMedication, 
                  remainingDoses: parseInt(e.target.value) || 0 
                })}
                className="input-enhanced"
                min="1"
                placeholder="30"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Reminder Times</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {newMedication.time?.map((time, index) => (
                <input
                  key={index}
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...(newMedication.time || [])];
                    newTimes[index] = e.target.value;
                    setNewMedication({ ...newMedication, time: newTimes });
                  }}
                  className="input-enhanced"
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={newMedication.notes}
              onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
              className="textarea-enhanced"
              placeholder="Special instructions, side effects to watch for, etc."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="refillReminder"
              checked={newMedication.refillReminder}
              onChange={(e) => setNewMedication({ 
                ...newMedication, 
                refillReminder: e.target.checked 
              })}
              className="checkbox-enhanced"
            />
            <label htmlFor="refillReminder" className="text-sm text-gray-700 dark:text-gray-300">
              Enable refill reminders
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Medication
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Edit Medication Modal */}
      <AccessibleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Medication"
        size="lg"
      >
        <form onSubmit={handleUpdateMedication} className="space-y-6">
          {/* Same form fields as add modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Medication Name *</label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                className="input-enhanced"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Dosage *</label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                className="input-enhanced"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Medication
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Prescription Scanner Modal */}
      <AccessibleModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        title="Scan Prescription"
      >
        <div className="space-y-6">
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Scan Your Prescription
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Take a photo of your prescription to automatically add medications
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowPrescriptionModal(false);
                info('Feature Coming Soon', 'Prescription scanning will be available soon!');
              }}
              className="w-full btn-primary"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </button>
            
            <button
              onClick={() => {
                setShowPrescriptionModal(false);
                info('Feature Coming Soon', 'File upload will be available soon!');
              }}
              className="w-full btn-secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </button>
          </div>
        </div>
      </AccessibleModal>

      {/* Doctor Appointment Modal */}
      <AccessibleModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Add Upcoming Appointment"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addAppointment({
              id: Date.now().toString(),
              doctorName: appointment.doctorName,
              specialty: 'General',
              date: new Date(appointment.date + 'T' + appointment.time),
              time: appointment.time,
              location: 'Clinic',
              notes: appointment.notes,
              status: 'scheduled',
              type: 'checkup',
            });
            setShowAppointmentModal(false);
            setAppointment({ doctorName: '', date: '', time: '', notes: '' });
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Doctor's Name"
            value={appointment.doctorName}
            onChange={e => setAppointment(a => ({ ...a, doctorName: e.target.value }))}
            className="input-enhanced w-full"
            required
          />
          <input
            type="date"
            value={appointment.date}
            onChange={e => setAppointment(a => ({ ...a, date: e.target.value }))}
            className="input-enhanced w-full"
            required
          />
          <input
            type="time"
            value={appointment.time}
            onChange={e => setAppointment(a => ({ ...a, time: e.target.value }))}
            className="input-enhanced w-full"
            required
          />
          <textarea
            placeholder="Notes (optional)"
            value={appointment.notes}
            onChange={e => setAppointment(a => ({ ...a, notes: e.target.value }))}
            className="input-enhanced w-full"
          />
          <button type="submit" className="btn-primary w-full">Add Appointment</button>
        </form>
      </AccessibleModal>

      {/* Upcoming Appointments List */}
      {appointments.length > 0 && (
        <motion.div 
          variants={itemVariants} 
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Upcoming Appointments
          </h2>
          <ul className="space-y-4">
            {appointments.filter((a: Appointment) => a.status === 'scheduled').map((a: Appointment) => (
              <li key={a.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Dr. {a.doctorName}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{a.date instanceof Date ? a.date.toLocaleDateString() : a.date} at {a.time}</div>
                  {a.notes && <div className="text-xs text-gray-400 mt-1">{a.notes}</div>}
    </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Manage Appointments Modal */}
      <AccessibleModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title="Manage Appointments"
      >
        <div className="space-y-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Upcoming Appointments
          </h2>
          <ul className="space-y-4">
            {appointments.filter((a: Appointment) => a.status === 'scheduled').map((a: Appointment) => (
              <li key={a.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Dr. {a.doctorName}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{a.date instanceof Date ? a.date.toLocaleDateString() : a.date} at {a.time}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{a.specialty} | {a.location}</div>
                  {a.notes && <div className="text-xs text-gray-400 mt-1">{a.notes}</div>}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button className="btn-primary btn-xs" onClick={() => { setEditingAppointment(a); }}>
                    Edit
                  </button>
                  <button className="btn-danger btn-xs" onClick={() => { deleteAppointment(a.id); }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {appointments.filter((a: Appointment) => a.status === 'scheduled').length === 0 && (
            <div className="text-gray-500 dark:text-gray-300 text-center">No upcoming appointments.</div>
          )}
        </div>
      </AccessibleModal>
      {/* Edit Appointment Modal */}
      <AccessibleModal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        title="Manage Appointment"
      >
        {editingAppointment && (
          <form
            onSubmit={e => {
              e.preventDefault();
              updateAppointment(editingAppointment.id, editingAppointment);
              setEditingAppointment(null);
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={editingAppointment.doctorName}
              onChange={e => setEditingAppointment(a => a ? { ...a, doctorName: e.target.value } : null)}
              className="input-enhanced w-full"
              required
              placeholder="Doctor Name"
            />
            <input
              type="text"
              value={editingAppointment.specialty}
              onChange={e => setEditingAppointment(a => a ? { ...a, specialty: e.target.value } : null)}
              className="input-enhanced w-full"
              required
              placeholder="Specialty"
            />
            <input
              type="date"
              value={editingAppointment.date instanceof Date ? editingAppointment.date.toISOString().slice(0,10) : editingAppointment.date}
              onChange={e => setEditingAppointment(a => a ? { ...a, date: new Date(e.target.value + 'T' + a.time) } : null)}
              className="input-enhanced w-full"
              required
            />
            <input
              type="time"
              value={editingAppointment.time}
              onChange={e => setEditingAppointment(a => a ? { ...a, time: e.target.value } : null)}
              className="input-enhanced w-full"
              required
            />
            <input
              type="text"
              value={editingAppointment.location}
              onChange={e => setEditingAppointment(a => a ? { ...a, location: e.target.value } : null)}
              className="input-enhanced w-full"
              required
              placeholder="Location"
            />
            <textarea
              value={editingAppointment.notes}
              onChange={e => setEditingAppointment(a => a ? { ...a, notes: e.target.value } : null)}
              className="input-enhanced w-full"
              placeholder="Notes (optional)"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn-secondary" onClick={() => setEditingAppointment(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn-danger" onClick={() => { deleteAppointment(editingAppointment.id); setEditingAppointment(null); }}>
                Delete Appointment
              </button>
            </div>
          </form>
        )}
      </AccessibleModal>
    </motion.div>
  );
}