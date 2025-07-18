import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganizerManager = ({ groupId, onUpdate }) => {
  const [organizers, setOrganizers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroupDashboard();
  }, [groupId]);

  const fetchGroupDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/groups/${groupId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrganizers(response.data.data.organizers || []);
        setParticipants(response.data.data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const handleAddOrganizer = async (e) => {
    e.preventDefault();
    if (!selectedParticipant) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/organizers`,
        { newOrganizerUserId: selectedParticipant },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchGroupDashboard();
        setSelectedParticipant('');
        setShowAddForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding organizer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrganizer = async (organizerId) => {
    if (!confirm('Are you sure you want to remove this organizer?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `/api/groups/${groupId}/organizers/${organizerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchGroupDashboard();
        onUpdate();
      }
    } catch (error) {
      console.error('Error removing organizer:', error);
    }
  };

  const availableParticipants = participants.filter(
    participant => !organizers.some(organizer => organizer.id === participant.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organizer Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
        >
          + Add Organizer
        </button>
      </div>

      {/* Add Organizer Form */}
      {showAddForm && (
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Organizer</h3>
          <form onSubmit={handleAddOrganizer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Participant</label>
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                required
              >
                <option value="">Choose a participant...</option>
                {availableParticipants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name} ({participant.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !selectedParticipant}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add as Organizer'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Organizers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Organizers ({organizers.length})</h3>
        
        {organizers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400 text-lg">No organizers assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizers.map((organizer) => (
              <div key={organizer.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {organizer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{organizer.name}</h4>
                    <p className="text-sm text-gray-400">{organizer.email}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                      {organizer.isOwner ? 'Owner' : 'Organizer'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Since {new Date(organizer.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {!organizer.isOwner && (
                    <button
                      onClick={() => handleRemoveOrganizer(organizer.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                      title="Remove organizer"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Organizer Permissions Info */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Organizer Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-400 mb-2">✅ Can Do:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Approve/reject expenses</li>
              <li>• Create attendance checks</li>
              <li>• Respond to SOS alerts</li>
              <li>• Create announcements</li>
              <li>• View all group statistics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-400 mb-2">❌ Cannot Do:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Delete the group</li>
              <li>• Remove the group owner</li>
              <li>• Change group settings</li>
              <li>• Access financial exports</li>
              <li>• Manage other organizers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerManager;
