import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { User, Shield, Mail, Phone, Heart, Calendar, Edit, Settings, Camera, X, Save, Lock, FileText, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import { motion } from 'framer-motion';

export default function Profile() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const { success, info } = useToast();
  
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 0,
    weight: user?.weight || 0,
    height: user?.height || 0,
    bloodType: user?.bloodType || 'A+',
    emergencyContactName: user?.emergencyContact?.name || '',
    emergencyContactPhone: user?.emergencyContact?.phone || '',
    emergencyContactRelationship: user?.emergencyContact?.relationship || '',
  });

  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Motivational quotes array and random selection
  const motivationalQuotes = [
    "Your health is your wealth!",
    "Every step counts. Start your journey today.",
    "Small changes make a big difference.",
    "Stay positive, stay healthy!",
    "You are your best investment."
  ];
  const randomQuote = React.useMemo(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], []);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-900 dark:text-white">No user data available</p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    setEditFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight || 0,
      height: user.height || 0,
      bloodType: user.bloodType || 'A+',
      emergencyContactName: user.emergencyContact?.name || '',
      emergencyContactPhone: user.emergencyContact?.phone || '',
      emergencyContactRelationship: user.emergencyContact?.relationship || '',
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name: editFormData.name,
      email: editFormData.email,
      age: editFormData.age,
      weight: editFormData.weight || undefined,
      height: editFormData.height || undefined,
      bloodType: editFormData.bloodType as any,
      emergencyContact: {
        name: editFormData.emergencyContactName,
        phone: editFormData.emergencyContactPhone,
        relationship: editFormData.emergencyContactRelationship,
      },
    };
    
    setUser(updatedUser);
    setShowEditModal(false);
    success('Profile Updated', 'Your profile has been successfully updated.');
  };

  const handleViewHealthRecords = () => {
    navigate('/health');
    info('Redirecting', 'Taking you to your health records...');
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handlePrivacy = () => {
    setShowPrivacyModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? 
        parseInt(value) || 0 : value
    }));
  };

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
      className="relative max-w-4xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
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
      {/* Profile Header */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
        </div>
        <div className="relative px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
            <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  {user.photo ? (
                    <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                <span className="text-white text-4xl font-bold">{user.name[0]}</span>
                  )}
              </div>
              <button 
                  onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                {/* Motivational Quote */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-2 flex items-center gap-2 text-blue-500 dark:text-blue-300 text-base font-medium">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>{randomQuote}</span>
                </motion.div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Patient ID: {user.id}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {user.role}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleEditProfile} className="btn-secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button 
                onClick={handleSettings}
                className="btn-icon text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user.gender}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.age} years old</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.bloodType || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user.role}</p>
              </div>
            </div>

            {user.weight && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.weight} kg</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </motion.div>

      {/* Emergency Contact */}
      {user.emergencyContact && (
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Contact</h2>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Contact Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Relationship</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.emergencyContact.relationship || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Phone Number</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.emergencyContact.phone}</p>
                  <a 
                    href={`tel:${user.emergencyContact.phone}`}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      )}

      {/* Medical Information */}
      {user.medicalHistory && (
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Medical History</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.medicalHistory.conditions && user.medicalHistory.conditions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Medical Conditions</h3>
                <ul className="space-y-2">
                  {user.medicalHistory.conditions.map((condition, index) => (
                    <li key={index} className="text-gray-900 dark:text-white text-sm">• {condition}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {user.medicalHistory.surgeries && user.medicalHistory.surgeries.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Surgeries</h3>
                <ul className="space-y-2">
                  {user.medicalHistory.surgeries.map((surgery, index) => (
                    <li key={index} className="text-gray-900 dark:text-white text-sm">• {surgery}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {user.medicalHistory.medications && user.medicalHistory.medications.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Current Medications</h3>
                <ul className="space-y-2">
                  {user.medicalHistory.medications.map((medication, index) => (
                    <li key={index} className="text-gray-900 dark:text-white text-sm">• {medication}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        </motion.div>
      )}

      {/* Allergies */}
      {user.allergies && user.allergies.length > 0 && (
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Allergies & Sensitivities</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex flex-wrap gap-2">
              {user.allergies.map((allergy, index) => (
                <span 
                  key={index}
                  className="px-3 py-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={handleEditProfile} className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <button onClick={handleSettings} className="btn-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button onClick={handleViewHealthRecords} className="btn-secondary">
            <Heart className="w-4 h-4 mr-2" />
            Health Records
          </button>
          <button onClick={handlePrivacy} className="btn-secondary">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </button>
        </div>
      </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AccessibleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                className="input-enhanced"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                className="input-enhanced"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                value={editFormData.age}
                onChange={handleInputChange}
                className="input-enhanced"
                min="1"
                max="150"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Type</label>
              <select
                name="bloodType"
                value={editFormData.bloodType}
                onChange={handleInputChange}
                className="select-enhanced"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={editFormData.weight}
                onChange={handleInputChange}
                className="input-enhanced"
                min="1"
                max="500"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={editFormData.height}
                onChange={handleInputChange}
                className="input-enhanced"
                min="50"
                max="300"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={editFormData.emergencyContactName}
                  onChange={handleInputChange}
                  className="input-enhanced"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Relationship</label>
                <input
                  type="text"
                  name="emergencyContactRelationship"
                  value={editFormData.emergencyContactRelationship}
                  onChange={handleInputChange}
                  className="input-enhanced"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={editFormData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className="input-enhanced"
                />
              </div>
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
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </AccessibleModal>

      {/* Settings Modal */}
      <AccessibleModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Account Settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your health</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">SMS Reminders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get medication reminders via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Data Sharing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Share anonymized data for research</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                success('Settings Saved', 'Your preferences have been updated.');
              }}
              className="btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </AccessibleModal>

      {/* Privacy Modal */}
      <AccessibleModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy & Security"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">Data Encryption</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    All your health data is encrypted using industry-standard AES-256 encryption.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">HIPAA Compliance</h3>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    We follow HIPAA guidelines to protect your medical information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-purple-800 dark:text-purple-300">Data Control</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    You have full control over your data. Request deletion or export anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full btn-secondary justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Download My Data
            </button>
            <button className="w-full btn-secondary justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
            <button className="w-full btn-danger justify-start">
              <X className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </AccessibleModal>

      {/* Photo Upload Modal */}
      <AccessibleModal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setPhotoPreview(null);
        }}
        title="Update Profile Photo"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden mb-4">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : user.photo ? (
                <img src={user.photo} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-4xl font-bold">{user.name[0]}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setPhotoPreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Photo
            </button>
            {photoPreview && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setUser({ ...user, photo: photoPreview });
                    setShowPhotoModal(false);
                    setPhotoPreview(null);
                    success('Profile Photo Updated', 'Your profile photo has been updated.');
                  }}
                >
                  Save Photo
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setPhotoPreview(null)}
                >
                  Choose Another
                </button>
              </div>
            )}
          </div>
    </div>
      </AccessibleModal>
    </motion.div>
  );
}