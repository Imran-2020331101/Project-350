import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceTracker = ({ groupId, isOrganizer, onUpdate }) => {
  const [attendanceChecks, setAttendanceChecks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCheck, setNewCheck] = useState({
    title: '',
    description: '',
    expiresIn: 30 // minutes
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceChecks();
  }, [groupId]);

  const fetchAttendanceChecks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/groups/${groupId}/attendance/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAttendanceChecks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance checks:', error);
    }
  };

  const handleCreateCheck = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/attendance`,
        newCheck,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchAttendanceChecks();
        setNewCheck({ title: '', description: '', expiresIn: 30 });
        setShowCreateForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error creating attendance check:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (attendanceId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/attendance/${attendanceId}/mark`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchAttendanceChecks();
        onUpdate();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  const getResponseRate = (check) => {
    if (!check.responses || check.responses.length === 0) return 0;
    return Math.round((check.responses.length / check.totalParticipants) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
        {isOrganizer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            + Create Check
          </button>
        )}
      </div>

      {/* Create Check Form */}
      {showCreateForm && (
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Create Attendance Check</h3>
          <form onSubmit={handleCreateCheck} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newCheck.title}
                onChange={(e) => setNewCheck({...newCheck, title: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                placeholder="e.g., Morning Roll Call"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newCheck.description}
                onChange={(e) => setNewCheck({...newCheck, description: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                rows="3"
                placeholder="Additional details about this attendance check"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expires In (minutes)</label>
              <select
                value={newCheck.expiresIn}
                onChange={(e) => setNewCheck({...newCheck, expiresIn: parseInt(e.target.value)})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Check'}
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

      {/* Attendance Checks List */}
      <div className="space-y-4">
        {attendanceChecks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-400 text-lg">No attendance checks yet</p>
          </div>
        ) : (
          attendanceChecks.map((check) => (
            <div key={check.id} className="bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold mb-2">{check.title}</h4>
                  <p className="text-gray-400 mb-2">{check.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-blue-400">
                      📅 {new Date(check.createdAt).toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isExpired(check.expiresAt) ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                      {isExpired(check.expiresAt) ? '⏰ Expired' : '🟢 Active'}
                    </span>
                  </div>
                </div>
                
                {!isExpired(check.expiresAt) && !check.userResponse && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAttendance(check.id, 'present')}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      ✅ Present
                    </button>
                    <button
                      onClick={() => handleMarkAttendance(check.id, 'absent')}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      ❌ Absent
                    </button>
                  </div>
                )}
              </div>

              {/* Response Summary */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Response Rate</span>
                  <span className="text-2xl font-bold text-green-400">
                    {getResponseRate(check)}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Present:</span>
                    <span className="text-green-400">
                      {check.responses?.filter(r => r.status === 'present').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Absent:</span>
                    <span className="text-red-400">
                      {check.responses?.filter(r => r.status === 'absent').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>No Response:</span>
                    <span className="text-gray-400">
                      {check.totalParticipants - (check.responses?.length || 0)}
                    </span>
                  </div>
                </div>

                {/* User's Response */}
                {check.userResponse && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <span className="text-sm text-gray-400">Your response: </span>
                    <span className={`font-semibold ${
                      check.userResponse.status === 'present' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {check.userResponse.status === 'present' ? '✅ Present' : '❌ Absent'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
