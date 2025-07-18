import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SOSManager = ({ groupId, isOrganizer, onUpdate }) => {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSOS, setNewSOS] = useState({
    type: 'help',
    message: '',
    priority: 'medium',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const sosTypes = [
    { value: 'help', label: 'General Help', icon: '🆘' },
    { value: 'medical', label: 'Medical Emergency', icon: '🚑' },
    { value: 'security', label: 'Security Issue', icon: '🚨' },
    { value: 'lost', label: 'Lost/Separated', icon: '🔍' },
    { value: 'accident', label: 'Accident', icon: '⚠️' },
    { value: 'other', label: 'Other Emergency', icon: '🔴' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-600' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-600' },
    { value: 'high', label: 'High', color: 'bg-orange-600' },
    { value: 'critical', label: 'Critical', color: 'bg-red-600' }
  ];

  useEffect(() => {
    fetchSOSAlerts();
  }, [groupId]);

  const fetchSOSAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/groups/${groupId}/sos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSosAlerts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching SOS alerts:', error);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewSOS({
          ...newSOS,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location');
        setLocationLoading(false);
      }
    );
  };

  const handleCreateSOS = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/sos`,
        newSOS,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchSOSAlerts();
        setNewSOS({ type: 'help', message: '', priority: 'medium', location: null });
        setShowCreateForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error creating SOS alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToSOS = async (sosId, response) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/groups/${groupId}/sos/${sosId}/respond`,
        { response },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        fetchSOSAlerts();
        onUpdate();
      }
    } catch (error) {
      console.error('Error responding to SOS:', error);
    }
  };

  const getTypeIcon = (type) => {
    const sosType = sosTypes.find(t => t.value === type);
    return sosType ? sosType.icon : '🆘';
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.color : 'bg-gray-600';
  };

  const isEmergency = (type) => {
    return ['medical', 'security', 'accident'].includes(type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SOS & Emergency System</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          🆘 Create SOS Alert
        </button>
      </div>

      {/* Create SOS Form */}
      {showCreateForm && (
        <div className="bg-gray-700 p-6 rounded-lg border-2 border-red-500">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Create Emergency Alert</h3>
          <form onSubmit={handleCreateSOS} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Emergency Type</label>
                <select
                  value={newSOS.type}
                  onChange={(e) => setNewSOS({...newSOS, type: e.target.value})}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                >
                  {sosTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  value={newSOS.priority}
                  onChange={(e) => setNewSOS({...newSOS, priority: e.target.value})}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Emergency Details</label>
              <textarea
                value={newSOS.message}
                onChange={(e) => setNewSOS({...newSOS, message: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                rows="4"
                placeholder="Describe your emergency situation..."
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {locationLoading ? 'Getting Location...' : '📍 Share Location'}
              </button>
              {newSOS.location && (
                <span className="text-green-400 text-sm">
                  ✅ Location shared
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 font-semibold"
              >
                {loading ? 'Sending Alert...' : '🚨 SEND SOS ALERT'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SOS Alerts List */}
      <div className="space-y-4">
        {sosAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🆘</div>
            <p className="text-gray-400 text-lg">No SOS alerts</p>
            <p className="text-gray-500 text-sm mt-2">Emergency alerts will appear here</p>
          </div>
        ) : (
          sosAlerts.map((alert) => (
            <div key={alert.id} className={`p-6 rounded-lg border-2 ${
              isEmergency(alert.type) ? 'border-red-500 bg-red-900/20' : 'border-yellow-500 bg-yellow-900/20'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTypeIcon(alert.type)}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {sosTypes.find(t => t.value === alert.type)?.label}
                    </h4>
                    <p className="text-sm text-gray-400">
                      by {alert.reportedBy.name} • {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(alert.priority)}`}>
                  {alert.priority.toUpperCase()}
                </span>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-gray-300">{alert.message}</p>
                {alert.location && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-sm text-blue-400 mb-2">📍 Location shared:</p>
                    <a
                      href={`https://maps.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Response Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleRespondToSOS(alert.id, 'acknowledged')}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  👁️ Acknowledged
                </button>
                <button
                  onClick={() => handleRespondToSOS(alert.id, 'on-way')}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  🏃 On My Way
                </button>
                <button
                  onClick={() => handleRespondToSOS(alert.id, 'reached')}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  ✅ Reached
                </button>
                {isOrganizer && (
                  <button
                    onClick={() => handleRespondToSOS(alert.id, 'resolved')}
                    className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    ✅ Resolved
                  </button>
                )}
              </div>

              {/* Responses */}
              {alert.responses && alert.responses.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Responses:</h5>
                  <div className="space-y-2">
                    {alert.responses.map((response, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-blue-400">{response.respondedBy.name}</span>
                        <span className="text-gray-400"> • {response.response} • </span>
                        <span className="text-gray-500">{new Date(response.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SOSManager;
