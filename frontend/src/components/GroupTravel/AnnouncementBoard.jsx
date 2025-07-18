import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementBoard = ({ groupId, isOrganizer, onUpdate }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-600', icon: '💚' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-600', icon: '💙' },
    { value: 'high', label: 'High', color: 'bg-orange-600', icon: '🧡' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-600', icon: '❤️' }
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [groupId]);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/groups/${groupId}/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/announcements`,
        newAnnouncement,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchAnnouncements();
        setNewAnnouncement({ title: '', content: '', priority: 'normal' });
        setShowCreateForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (announcementId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/groups/${groupId}/announcements/${announcementId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchAnnouncements();
        onUpdate();
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const level = priorities.find(p => p.value === priority);
    return level ? level.color : 'bg-gray-600';
  };

  const getPriorityIcon = (priority) => {
    const level = priorities.find(p => p.value === priority);
    return level ? level.icon : '💙';
  };

  const getReadPercentage = (announcement) => {
    if (!announcement.readBy || announcement.readBy.length === 0) return 0;
    return Math.round((announcement.readBy.length / announcement.totalParticipants) * 100);
  };

  const isUnread = (announcement) => {
    if (!announcement.readBy) return true;
    const userId = localStorage.getItem('userId');
    return !announcement.readBy.some(read => read.userId === userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Group Announcements</h2>
        {isOrganizer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            📢 New Announcement
          </button>
        )}
      </div>

      {/* Create Announcement Form */}
      {showCreateForm && (
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Important Update on Tomorrow's Schedule"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority Level</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.icon} {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                rows="6"
                placeholder="Write your announcement here..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Publishing...' : '📢 Publish Announcement'}
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-gray-400 text-lg">No announcements yet</p>
            <p className="text-gray-500 text-sm mt-2">Important updates will appear here</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`p-6 rounded-lg border-l-4 ${
                isUnread(announcement) ? 'bg-gray-700 border-blue-500' : 'bg-gray-800 border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPriorityIcon(announcement.priority)}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {announcement.title}
                      {isUnread(announcement) && (
                        <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded-full">NEW</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400">
                      by {announcement.createdBy.name} • {new Date(announcement.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                  {isUnread(announcement) && (
                    <button
                      onClick={() => handleMarkAsRead(announcement.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-gray-300 whitespace-pre-wrap">{announcement.content}</p>
              </div>

              {/* Read Receipt Stats */}
              {isOrganizer && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Read Status</span>
                    <span className="text-lg font-bold text-blue-400">
                      {getReadPercentage(announcement)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getReadPercentage(announcement)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Read: {announcement.readBy?.length || 0}</span>
                    <span>Total: {announcement.totalParticipants}</span>
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

export default AnnouncementBoard;
