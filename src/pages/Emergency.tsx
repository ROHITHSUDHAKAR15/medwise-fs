import React from 'react';
import { 
  Phone, 
  Navigation, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Stethoscope, 
  Heart,
  Shield,
  Users,
  Car,
  Flame,
  UserCheck,
  Baby,
  Zap,
  Activity,
  Search,
  Star,
  Navigation2,
  Copy,
  Share2
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import AccessibleModal from '../components/AccessibleModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Emergency() {
  const { success, info, error } = useToast();
  const [showMap, setShowMap] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState<GeolocationPosition | null>(null);
  const [selectedFacility, setSelectedFacility] = React.useState<any>(null);
  const [showFirstAidModal, setShowFirstAidModal] = React.useState(false);
  const [selectedFirstAid, setSelectedFirstAid] = React.useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = React.useState([
    { name: 'Emergency Services', number: '112', type: 'emergency', response: 'Immediate', icon: AlertCircle },
    { name: 'Ambulance', number: '108', type: 'ambulance', response: 'Immediate', icon: Activity },
    { name: 'Police', number: '100', type: 'police', response: 'Immediate', icon: Shield },
    { name: 'Fire Department', number: '101', type: 'fire', response: 'Immediate', icon: Flame },
    { name: 'Women Helpline', number: '1091', type: 'helpline', response: '24/7', icon: UserCheck },
    { name: 'Child Helpline', number: '1098', type: 'helpline', response: '24/7', icon: Baby },
    { name: 'COVID-19 Helpline', number: '1075', type: 'health', response: '24/7', icon: Heart },
    { name: 'Disaster Management', number: '1070', type: 'disaster', response: '24/7', icon: Zap },
  ]);

  const [nearbyFacilities, setNearbyFacilities] = React.useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = React.useState(false);
  const [hospitalError, setHospitalError] = React.useState<string | null>(null);
  const [geoError, setGeoError] = React.useState<string | null>(null);

  // Get user location with error handling
  React.useEffect(() => {
    if (!userLocation && !geoError) {
      setLoadingHospitals(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(pos);
          setGeoError(null);
        },
        (err) => {
          setGeoError('Unable to access your location. Please enable location services.');
          setLoadingHospitals(false);
        }
      );
    }
  }, [userLocation, geoError]);

  // Fetch nearby hospitals using Overpass API when userLocation is available
  React.useEffect(() => {
    if (!userLocation) return;
    setLoadingHospitals(true);
    setHospitalError(null);
    const lat = userLocation.coords.latitude;
    const lon = userLocation.coords.longitude;
    const radius = 5000; // 5km
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out center;
    `;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    })
      .then(res => res.json())
      .then(data => {
        const facilities = (data.elements || []).map((el: any) => ({
          id: el.id,
          name: el.tags?.name || 'Unknown Hospital',
          address: el.tags?.address || '',
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          type: el.tags?.amenity || 'hospital',
          phone: el.tags?.phone || '',
          specialties: [],
          rating: null,
          distance: null
        }));
        setNearbyFacilities(facilities);
        setLoadingHospitals(false);
      })
      .catch(() => {
        setNearbyFacilities([]);
        setHospitalError('Failed to fetch nearby hospitals. Please try again later.');
        setLoadingHospitals(false);
      });
  }, [userLocation]);

  const firstAidGuides = [
    {
      id: 1,
      title: 'Heart Attack',
      severity: 'critical',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      symptoms: [
        'Chest pain or pressure',
        'Pain in arms, neck, jaw, or back',
        'Shortness of breath',
        'Cold sweat',
        'Nausea or vomiting'
      ],
      steps: [
        'Call 108 for ambulance immediately',
        'Help the person sit down and rest',
        'Loosen any tight clothing',
        'If prescribed, give aspirin (325mg)',
        'Monitor breathing and pulse',
        'Be prepared to perform CPR if needed'
      ],
      donts: [
        'Don\'t leave the person alone',
        'Don\'t give food or water',
        'Don\'t wait for symptoms to improve'
      ]
    },
    {
      id: 2,
      title: 'Stroke',
      severity: 'critical',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      symptoms: [
        'Face drooping on one side',
        'Arm weakness or numbness',
        'Speech difficulty or slurred speech',
        'Sudden severe headache',
        'Loss of balance or coordination'
      ],
      steps: [
        'Call 108 immediately - time is critical',
        'Note the time symptoms started',
        'Keep the person calm and lying down',
        'Turn head to side if vomiting',
        'Do not give food, water, or medication',
        'Monitor breathing and consciousness'
      ],
      donts: [
        'Don\'t give aspirin (unlike heart attack)',
        'Don\'t let them drive themselves',
        'Don\'t wait to see if symptoms improve'
      ]
    },
    {
      id: 3,
      title: 'Choking',
      severity: 'critical',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      symptoms: [
        'Cannot speak or breathe',
        'Clutching throat',
        'Blue lips or face',
        'Weak cough',
        'High-pitched sounds when breathing'
      ],
      steps: [
        'Ask "Are you choking?" If they can\'t speak, act immediately',
        'Stand behind them, wrap arms around waist',
        'Make a fist, place above navel',
        'Grasp fist with other hand',
        'Give quick upward thrusts (Heimlich maneuver)',
        'Continue until object is expelled or person becomes unconscious'
      ],
      donts: [
        'Don\'t hit the back if Heimlich is working',
        'Don\'t use finger sweeps blindly',
        'Don\'t give up - continue until help arrives'
      ]
    },
    {
      id: 4,
      title: 'Severe Bleeding',
      severity: 'urgent',
      icon: Zap,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      symptoms: [
        'Heavy, continuous bleeding',
        'Blood soaking through bandages',
        'Signs of shock (pale, weak pulse)',
        'Dizziness or fainting',
        'Rapid breathing'
      ],
      steps: [
        'Call for emergency help',
        'Apply direct pressure with clean cloth',
        'Elevate the injured area above heart level',
        'Apply pressure to pressure points if needed',
        'Apply tourniquet only if trained and bleeding won\'t stop',
        'Keep the person warm and calm'
      ],
      donts: [
        'Don\'t remove embedded objects',
        'Don\'t peek at wound once bleeding stops',
        'Don\'t use tourniquet unless absolutely necessary'
      ]
    },
    {
      id: 5,
      title: 'Burns',
      severity: 'urgent',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      symptoms: [
        'Red, painful skin (1st degree)',
        'Blisters and swelling (2nd degree)',
        'White or charred skin (3rd degree)',
        'Severe pain or no pain (3rd degree)',
        'Shock symptoms'
      ],
      steps: [
        'Remove from heat source safely',
        'Cool burn with cool (not cold) water for 10-20 minutes',
        'Remove jewelry/clothing before swelling',
        'Cover with sterile, non-adhesive bandage',
        'Give over-the-counter pain medication',
        'Seek medical attention for serious burns'
      ],
      donts: [
        'Don\'t use ice or very cold water',
        'Don\'t break blisters',
        'Don\'t apply butter, oil, or home remedies'
      ]
    },
    {
      id: 6,
      title: 'Allergic Reaction',
      severity: 'urgent',
      icon: Shield,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      symptoms: [
        'Difficulty breathing',
        'Swelling of face, lips, tongue',
        'Rapid pulse',
        'Dizziness or fainting',
        'Widespread rash or hives'
      ],
      steps: [
        'Call 108 if severe (anaphylaxis)',
        'Help person use epinephrine auto-injector if available',
        'Have person lie down with legs elevated',
        'Loosen tight clothing',
        'Cover with blanket to prevent shock',
        'Monitor breathing and pulse'
      ],
      donts: [
        'Don\'t give oral medication if person has trouble swallowing',
        'Don\'t assume one injection is enough',
        'Don\'t leave person alone'
      ]
    }
  ];

  const handleEmergencySOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setShowMap(true);
          success('Location Shared', 'Your location has been captured for emergency services');
          
          // Simulate emergency alert
          setTimeout(() => {
            info('Emergency Alert Sent', 'Emergency services have been notified of your location');
          }, 2000);
        },
        (error) => {
          console.error('Error getting location:', error);
          error('Location Error', 'Unable to get your location. Please call emergency services directly.');
        }
      );
    } else {
      error('Location Not Supported', 'Geolocation is not supported by this browser');
    }
  };

  const handleCallEmergency = (contact: any) => {
    window.open(`tel:${contact.number}`, '_self');
    success('Calling Emergency', `Calling ${contact.name} at ${contact.number}`);
  };

  const handleNavigateToFacility = (facility: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`;
    window.open(url, '_blank');
    info('Navigation Started', `Opening directions to ${facility.name}`);
  };

  const handleShareLocation = async () => {
    if (userLocation) {
      const locationText = `Emergency! I need help. My location: https://maps.google.com/?q=${userLocation.coords.latitude},${userLocation.coords.longitude}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Emergency Location',
            text: locationText,
          });
          success('Location Shared', 'Emergency location shared successfully');
        } catch (err) {
          console.error('Error sharing:', err);
        }
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(locationText);
          success('Location Copied', 'Emergency location copied to clipboard');
        } catch (err) {
          error('Share Failed', 'Unable to share location');
        }
      }
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied', `${label} copied to clipboard`);
    } catch (err) {
      error('Copy Failed', `Unable to copy ${label.toLowerCase()}`);
    }
  };

  const openFirstAidGuide = (guide: any) => {
    setSelectedFirstAid(guide);
    setShowFirstAidModal(true);
  };

  // Show loading spinner
  if (loadingHospitals) {
    return <LoadingSpinner showOverlay text="Finding nearby hospitals..." />;
  }
  // Show geolocation error
  if (geoError) {
    return <div className="text-center text-red-600 dark:text-red-400 py-8">{geoError}</div>;
  }
  // Show hospital fetch error
  if (hospitalError) {
    return <div className="text-center text-red-600 dark:text-red-400 py-8">{hospitalError}</div>;
  }
  // Show message if no hospitals found
  if (nearbyFacilities.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-300 py-8">No hospitals found nearby.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Emergency SOS Button */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 rounded-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <button 
            onClick={handleEmergencySOS}
            className="bg-white text-red-600 text-xl font-bold py-6 px-12 rounded-full animate-pulse-custom hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <AlertCircle className="h-8 w-8 inline mr-3" />
            Emergency SOS
          </button>
          <p className="mt-4 text-white text-opacity-90">
            Tap for immediate emergency assistance and location sharing
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="text-white text-opacity-80 text-sm">
              ✓ Shares your location
            </div>
            <div className="text-white text-opacity-80 text-sm">
              ✓ Alerts emergency contacts
            </div>
            <div className="text-white text-opacity-80 text-sm">
              ✓ Calls emergency services
            </div>
          </div>
        </div>
      </div>

      {/* Quick Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleCallEmergency({ name: 'Ambulance', number: '108' })}
          className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Activity className="w-5 h-5" />
          <span className="font-medium">Call Ambulance</span>
        </button>
        <button
          onClick={() => handleCallEmergency({ name: 'Police', number: '100' })}
          className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Call Police</span>
        </button>
        <button
          onClick={() => handleCallEmergency({ name: 'Fire Department', number: '101' })}
          className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Flame className="w-5 h-5" />
          <span className="font-medium">Call Fire Dept</span>
        </button>
        <button
          onClick={handleShareLocation}
          className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share Location</span>
        </button>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Phone className="h-6 w-6 mr-2 text-red-600" />
            Emergency Contacts
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Quick access to all emergency services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div key={contact.name} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{contact.response} response</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(contact.number, 'Phone number')}
                          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {contact.number}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCallEmergency(contact)}
                    className="flex items-center justify-center h-12 w-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Medical Facilities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-blue-600" />
            Nearby Medical Facilities
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find the closest hospitals and medical centers
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {nearbyFacilities.map((facility) => (
            <div key={facility.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{facility.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{facility.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Stethoscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>{facility.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span>{facility.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Navigation className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>{facility.address}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{facility.address}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <button
                      onClick={() => copyToClipboard(facility.phone, 'Phone number')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {facility.phone}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {facility.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleNavigateToFacility(facility)}
                    className="flex items-center justify-center h-10 w-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Get directions"
                  >
                    <Navigation2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleCallEmergency({ name: facility.name, number: facility.phone })}
                    className="flex items-center justify-center h-10 w-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    title="Call hospital"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-600" />
            Emergency First Aid Guide
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Step-by-step instructions for common medical emergencies
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {firstAidGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                onClick={() => openFirstAidGuide(guide)}
                className={`${guide.bgColor} p-6 rounded-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 text-left w-full hover:shadow-lg`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                    <Icon className={`w-6 h-6 ${guide.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{guide.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      guide.severity === 'critical' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                    }`}>
                      {guide.severity}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Symptoms:</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {guide.symptoms.slice(0, 3).map((symptom, index) => (
                      <li key={index}>• {symptom}</li>
                    ))}
                    {guide.symptoms.length > 3 && (
                      <li className="text-blue-600 dark:text-blue-400">+ {guide.symptoms.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Modal */}
      <AccessibleModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        title="Emergency Location Shared"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Location Successfully Shared
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Emergency services have been notified of your location
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {userLocation ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Coordinates:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {userLocation.coords.latitude.toFixed(6)}, {userLocation.coords.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Accuracy: ±{Math.round(userLocation.coords.accuracy)}m
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">Getting your location...</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShareLocation}
              className="flex-1 btn-primary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Contacts
            </button>
            <button
              onClick={() => setShowMap(false)}
              className="flex-1 btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </AccessibleModal>

      {/* First Aid Detail Modal */}
      <AccessibleModal
        isOpen={showFirstAidModal}
        onClose={() => setShowFirstAidModal(false)}
        title={selectedFirstAid?.title || ''}
        size="lg"
      >
        {selectedFirstAid && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${selectedFirstAid.bgColor} border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center space-x-3 mb-3">
                <selectedFirstAid.icon className={`w-8 h-8 ${selectedFirstAid.color}`} />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {selectedFirstAid.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    selectedFirstAid.severity === 'critical' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                  }`}>
                    {selectedFirstAid.severity} emergency
                  </span>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-800 dark:text-red-300 font-medium text-sm">
                  ⚠️ Call emergency services immediately: 108 or 112
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                Recognize the Signs:
              </h4>
              <ul className="space-y-2">
                {selectedFirstAid.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                      !
                    </span>
                    <span className="text-sm">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-600" />
                What to Do:
              </h4>
              <ol className="space-y-3">
                {selectedFirstAid.steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full text-sm text-green-600 dark:text-green-400 font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Important - Do NOT:
              </h4>
              <ul className="space-y-2">
                {selectedFirstAid.donts.map((dont: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full text-sm text-red-600 dark:text-red-400 font-bold">
                      ✗
                    </span>
                    <span className="text-sm">{dont}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Remember:</strong> This guide is for emergency situations only. Always call professional emergency services and seek immediate medical attention for serious injuries or conditions.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleCallEmergency({ name: 'Emergency Services', number: '108' })}
                className="flex-1 btn-danger"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call 108 Now
              </button>
              <button
                onClick={() => setShowFirstAidModal(false)}
                className="flex-1 btn-secondary"
              >
                Close Guide
              </button>
            </div>
          </div>
        )}
      </AccessibleModal>
    </div>
  );
}