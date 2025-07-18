import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Shield, AlertTriangle, Search } from 'lucide-react';
import axios from '../config/axiosConfig';

const EmergencyAssistance = () => {
  const [location, setLocation] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [contactTypes, setContactTypes] = useState([
    // Fallback contact types in case API fails
    'police',
    'fire', 
    'medical',
    'embassy',
    'tourist_helpline',
    'coast_guard',
    'rescue'
  ]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch available contact types on component mount
  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        console.log('Fetching contact types...');
        const response = await axios.get('/api/emergency/types');
        console.log('Contact types response:', response.data);
        
        if (response.data.success && response.data.types) {
          // Extract just the values from the types array
          const typeValues = response.data.types.map(type => 
            typeof type === 'object' ? type.value : type
          );
          setContactTypes(typeValues);
          console.log('Contact types updated from API:', typeValues);
        } else {
          console.warn('API response missing types, using fallback');
        }
      } catch (error) {
        console.error('Error fetching contact types:', error);
        console.log('Using fallback contact types due to API error');
        // Keep the fallback contact types that were set in initial state
      }
    };
    fetchContactTypes();
  }, []);

  // Fetch emergency contacts for a location
  const fetchEmergencyContacts = async (loc) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/emergency/${encodeURIComponent(loc)}`);
      setEmergencyContacts(response.data.contacts || []);
    } catch {
      setError('Failed to fetch emergency contacts. Please try again.');
      setEmergencyContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Search emergency contacts
  const searchEmergencyContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (selectedType !== 'all') params.append('contactType', selectedType);
      if (searchTerm) params.append('name', searchTerm);

      const response = await axios.get(`/api/emergency/search?${params.toString()}`);
      setEmergencyContacts(response.data.contacts || []);
    } catch {
      setError('Failed to search emergency contacts. Please try again.');
      setEmergencyContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchEmergencyContacts(location.trim());
    } else {
      searchEmergencyContacts();
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async () => {
        try {
          // You might want to use a reverse geocoding service here
          // For now, we'll just show a message
          setLocation('Current Location');
          setError('Please enter your city or country name for emergency contacts.');
        } catch {
          setError('Unable to determine your location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  // Format contact type for display
  const formatContactType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get icon for contact type
  const getContactIcon = (type) => {
    switch (type) {
      case 'police': return '🚔';
      case 'fire': return '🚒';
      case 'medical': return '🚑';
      case 'coast_guard': return '⛵';
      case 'embassy': return '🏛️';
      case 'tourist_helpline': return '📞';
      default: return '📋';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-100';
      case 2: return 'text-orange-600 bg-orange-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-red-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-200">Emergency Assistance</h1>
        </div>
        <p className="text-gray-200 text-lg">
          Get instant access to emergency contacts for your location
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter city or country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Contact Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Emergency Types</option>
                {contactTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatContactType(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Term */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search Emergency Contacts'
              )}
            </button>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use Current Location
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Emergency Contacts Grid */}
      {emergencyContacts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-6">
            Emergency Contacts ({emergencyContacts.length} found)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.contactID}
                className="bg-gray-900 border border-gray-600 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                {/* Contact Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">
                      {getContactIcon(contact.contactType)}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-200">
                        {contact.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        Priority {contact.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Type */}
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {formatContactType(contact.contactType)}
                  </span>
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <div className="flex items-center text-gray-200">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      {contact.phoneNumber}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-3">
                  <div className="flex items-center text-gray-200">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contact.location}</span>
                  </div>
                </div>

                {/* Address */}
                {contact.address && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-200">{contact.address}</p>
                  </div>
                )}

                {/* Description */}
                {contact.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-200">{contact.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Call Now
                  </a>
                  {contact.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && emergencyContacts.length === 0 && location && (
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            No Emergency Contacts Found
          </h3>
          <p className="text-gray-200">
            Try searching for a different location or contact type.
          </p>
        </div>
      )}

      {/* Emergency Tips */}
      <div className="mt-12 bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
          <Clock className="h-6 w-6 mr-2" />
          Emergency Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
          <div>
            <h4 className="font-semibold mb-2">Before You Travel:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Save important numbers in your phone</li>
              <li>Keep emergency contacts written down</li>
              <li>Know your embassy/consulate location</li>
              <li>Have local currency for phone calls</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">In An Emergency:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Stay calm and assess the situation</li>
              <li>Call the most relevant emergency service</li>
              <li>Provide clear location information</li>
              <li>Follow operator instructions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAssistance;
