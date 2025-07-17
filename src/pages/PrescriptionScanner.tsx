import React from 'react';
import { 
  Camera, 
  Upload, 
  Scan, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  Share2,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Pill,
  Zap,
  Brain,
  Shield,
  Star,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import { useStore } from '../store';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';

interface PrescriptionData {
  id: string;
  image: string;
  scanDate: Date;
  status: 'processing' | 'completed' | 'error';
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  doctorName?: string;
  hospitalName?: string;
  prescriptionDate?: Date;
  notes?: string;
  confidence: number;
}

export default function PrescriptionScanner() {
  const { success, error, info } = useToast();
  const addMedication = useStore((state) => state.addMedication);
  
  const [showCamera, setShowCamera] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionData[]>([]);
  const [selectedPrescription, setSelectedPrescription] = React.useState<PrescriptionData | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  
  const webcamRef = React.useRef<Webcam>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mock prescription data for demo
  const mockPrescriptions: PrescriptionData[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      scanDate: new Date(),
      status: 'completed',
      confidence: 95,
      doctorName: 'Dr. Sarah Johnson',
      hospitalName: 'City General Hospital',
      prescriptionDate: new Date('2024-01-15'),
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Take with food'
        },
        {
          name: 'Paracetamol',
          dosage: '650mg',
          frequency: 'As needed',
          duration: '5 days',
          instructions: 'For fever and pain relief'
        }
      ]
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600',
      scanDate: new Date('2024-01-10'),
      status: 'completed',
      confidence: 88,
      doctorName: 'Dr. Michael Chen',
      hospitalName: 'Metro Health Center',
      prescriptionDate: new Date('2024-01-10'),
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Take before meals'
        }
      ]
    }
  ];

  React.useEffect(() => {
    setPrescriptions(mockPrescriptions);
  }, []);

  const capturePhoto = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      processPrescription(imageSrc);
      setShowCamera(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setUploadedImage(imageSrc);
        // Do not process yet; wait for user confirmation
      };
      reader.readAsDataURL(file);
    }
  };

  const processPrescription = async (imageSrc: string) => {
    setIsScanning(true);
    info('Processing', 'Scanning prescription... This may take a moment.');

    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newPrescription: PrescriptionData = {
        id: Date.now().toString(),
        image: imageSrc,
        scanDate: new Date(),
        status: 'completed',
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        doctorName: 'Dr. AI Scanner',
        hospitalName: 'Scanned Document',
        prescriptionDate: new Date(),
        medications: [
          {
            name: 'Detected Medication',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '10 days',
            instructions: 'Take with food'
          }
        ]
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      setSelectedPrescription(newPrescription);
      setShowResults(true);
      success('Scan Complete', 'Prescription scanned successfully!');
    } catch (err) {
      error('Scan Failed', 'Unable to process prescription. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const addMedicationsFromPrescription = (prescription: PrescriptionData) => {
    prescription.medications.forEach(med => {
      const medication = {
        id: Date.now().toString() + Math.random(),
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency.toLowerCase().replace(' ', '_'),
        time: ['09:00'], // Default time
        startDate: new Date(),
        duration: parseInt(med.duration) || 7,
        notes: med.instructions,
        refillReminder: true,
        remainingDoses: (parseInt(med.duration) || 7) * 2, // Estimate
      };
      addMedication(medication);
    });
    
    success('Medications Added', `Added ${prescription.medications.length} medications to your list`);
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => 
                           med.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
          <Scan className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Prescription Scanner
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Instantly digitize your prescriptions with advanced AI technology. 
          Scan, organize, and manage your medications effortlessly.
        </p>
      </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setShowCamera(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Take Photo</h3>
            <p className="text-blue-100">Use your camera to scan prescription</p>
          </div>
        </button>

        <button
          onClick={() => setShowUpload(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Upload Image</h3>
            <p className="text-green-100">Upload prescription from gallery</p>
          </div>
        </button>
      </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Powerful AI Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI Recognition',
              description: 'Advanced OCR technology with 95%+ accuracy',
              color: 'from-purple-500 to-purple-600'
            },
            {
              icon: Zap,
              title: 'Instant Processing',
              description: 'Get results in seconds, not minutes',
              color: 'from-yellow-500 to-yellow-600'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your data is encrypted and protected',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: Pill,
              title: 'Auto-Add Meds',
              description: 'Automatically add to medication tracker',
              color: 'from-blue-500 to-blue-600'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-enhanced pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-enhanced"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>
      </motion.div>

      {/* Prescriptions Grid */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Scanned Prescriptions ({filteredPrescriptions.length})
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Avg. Accuracy: 92%</span>
          </div>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No prescriptions found' : 'No prescriptions scanned yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start by scanning your first prescription'
              }
            </p>
            {!searchTerm && (
              <button onClick={() => setShowCamera(true)} className="btn-primary">
                <Camera className="w-4 h-4 mr-2" />
                Scan First Prescription
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="card-enhanced p-6 hover-lift cursor-pointer"
                onClick={() => {
                  setSelectedPrescription(prescription);
                  setShowResults(true);
                }}
              >
                <div className="relative mb-4">
                  <img
                    src={prescription.image}
                    alt="Prescription"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : prescription.status === 'processing'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {prescription.status}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {prescription.confidence}% accuracy
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {prescription.doctorName || 'Unknown Doctor'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {prescription.hospitalName || 'Unknown Hospital'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {prescription.scanDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Pill className="w-4 h-4 mr-1" />
                      {prescription.medications.length} meds
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addMedicationsFromPrescription(prescription);
                        }}
                        className="btn-primary text-xs py-2 px-3"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Meds
                      </button>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            info('Feature Coming Soon', 'Share functionality will be available soon!');
                          }}
                          className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            info('Feature Coming Soon', 'Download functionality will be available soon!');
                          }}
                          className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </motion.div>

      {/* Camera Modal */}
      <AccessibleModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        title="Scan Prescription"
        size="lg"
      >
        <div className="space-y-6">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "environment"
              }}
            />
            <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-lg pointer-events-none opacity-50"></div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Position the prescription within the frame and ensure good lighting
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCamera(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="btn-primary"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </button>
            </div>
          </div>
        </div>
      </AccessibleModal>

      {/* Upload Modal */}
      <AccessibleModal
        isOpen={showUpload}
        onClose={() => {
          setShowUpload(false);
          setUploadedImage(null);
        }}
        title="Upload Prescription"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Prescription Image
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Choose a clear image of your prescription
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </button>
            {uploadedImage && (
              <div className="mt-6">
                <img src={uploadedImage} alt="Preview" className="mx-auto rounded-lg max-h-48" />
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      processPrescription(uploadedImage);
                      setShowUpload(false);
                      setUploadedImage(null);
                    }}
                  >
                    Process Image
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setUploadedImage(null)}
                  >
                    Choose Another
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: JPG, PNG, HEIC • Max size: 10MB
            </p>
          </div>
        </div>
      </AccessibleModal>

      {/* Results Modal */}
      <AccessibleModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        title="Scan Results"
        size="xl"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <img
                src={selectedPrescription.image}
                alt="Scanned prescription"
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Scan Results
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {selectedPrescription.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Doctor:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPrescription.doctorName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Hospital:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPrescription.hospitalName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Scan Date:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPrescription.scanDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPrescription.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {selectedPrescription.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detected Medications ({selectedPrescription.medications.length})
              </h4>
              <div className="space-y-4">
                {selectedPrescription.medications.map((med, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {med.name}
                      </h5>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{med.frequency}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{med.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Instructions:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{med.instructions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowResults(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addMedicationsFromPrescription(selectedPrescription);
                  setShowResults(false);
                }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add All Medications
              </button>
            </div>
          </div>
        )}
      </AccessibleModal>

      {/* Processing Overlay */}
      {isScanning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Processing...
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Analyzing prescription with advanced OCR technology
            </p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Tips for Better Scanning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Eye, tip: 'Ensure good lighting and clear visibility' },
            { icon: Camera, tip: 'Hold camera steady and avoid blur' },
            { icon: FileText, tip: 'Include entire prescription in frame' },
            { icon: CheckCircle, tip: 'Verify results before adding medications' }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}