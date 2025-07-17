import React from 'react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SYMPTOM_OPTIONS = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath', 'Stomach Pain', 'Back Pain', 'Sore Throat', 'Joint Pain'
];

// Simple mapping for demonstration
const DISEASE_MAP: Record<string, string[]> = {
  'Fever,Cough': ['Flu', 'COVID-19', 'Common Cold'],
  'Headache,Nausea': ['Migraine', 'Tension Headache'],
  'Chest Pain,Shortness of Breath': ['Heart Attack', 'Angina'],
  'Stomach Pain,Nausea': ['Gastritis', 'Food Poisoning'],
  'Back Pain,Joint Pain': ['Arthritis', 'Muscle Strain'],
  // ... add more mappings as needed
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

function DiseasePredictor() {
  const { info, error, success } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [predictedDiseases, setPredictedDiseases] = React.useState<string[]>([]);
  const [showResult, setShowResult] = React.useState(false);

  const handleSymptomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSymptoms(options);
  };

  const handlePredict = () => {
    if (selectedSymptoms.length === 0) {
      error('No Symptoms Selected', 'Please select at least one symptom.');
      return;
    }
    // Find best match in DISEASE_MAP
    const key = Object.keys(DISEASE_MAP).find(k => {
      const required = k.split(',');
      return required.every(sym => selectedSymptoms.includes(sym));
    });
    if (key) {
      setPredictedDiseases(DISEASE_MAP[key]);
      success('Prediction Complete', 'Most probable diseases predicted.');
    } else {
      setPredictedDiseases(['No clear match. Please consult a doctor.']);
      info('No Match', 'No probable disease found for the selected symptoms.');
    }
    setShowResult(true);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disease Predictor</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
          Select your symptoms and predict the most probable disease.
        </p>
      </div>
      </motion.div>
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="form-group">
          <label className="form-label">Select Symptoms</label>
                      <select
            multiple
            value={selectedSymptoms}
            onChange={handleSymptomChange}
            className="select-enhanced h-40"
                      >
            {SYMPTOM_OPTIONS.map(symptom => (
              <option key={symptom} value={symptom}>{symptom}</option>
                        ))}
                      </select>
          <p className="text-xs text-gray-500 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple symptoms.</p>
        </div>
        <button onClick={handlePredict} className="btn-primary w-full">Predict Disease</button>
        {showResult && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Prediction Result</h2>
            <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200">
              {predictedDiseases.map((disease, idx) => (
                <li key={idx}>{disease}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </motion.div>
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">When to Seek Immediate Medical Attention</h3>
            <ul className="space-y-1 text-red-600 dark:text-red-300 text-sm">
              <li>• Severe or persistent chest pain</li>
              <li>• Difficulty breathing or shortness of breath</li>
              <li>• Sudden severe headache</li>
              <li>• High fever that doesn't respond to medication</li>
              <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
              <li>• Severe allergic reactions</li>
            </ul>
            <button 
              onClick={() => {
                window.open('tel:112', '_self');
                info('Emergency Call', 'Calling emergency services...');
              }}
              className="mt-4 btn-danger"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Call Emergency Services
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

export default DiseasePredictor;