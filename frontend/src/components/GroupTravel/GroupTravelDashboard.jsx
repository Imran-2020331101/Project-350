import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExpenseManager from './ExpenseManager';
import AttendanceTracker from './AttendanceTracker';
import SOSManager from './SOSManager';
import AnnouncementBoard from './AnnouncementBoard';
import OrganizerManager from './OrganizerManager';

const GroupTravelDashboard = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [groupData, setGroupData] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupDashboard();
  }, [groupId]);

  const fetchGroupDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setGroupData(response.data.data);
        setIsOrganizer(response.data.data.isOrganizer);
      }
    } catch (error) {
      console.error('Error fetching group dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'sos', label: 'SOS', icon: '🚨' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    ...(isOrganizer ? [{ id: 'organizers', label: 'Organizers', icon: '👥' }] : [])
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{groupData?.groupName}</h1>
          <p className="text-gray-400 mb-4">{groupData?.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-blue-600 px-3 py-1 rounded-full">
              👥 {groupData?.totalParticipants} participants
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full">
              💰 ${groupData?.totalExpenses} expenses
            </span>
            <span className="bg-yellow-600 px-3 py-1 rounded-full">
              ✅ {groupData?.activeAttendanceChecks} active checks
            </span>
            <span className="bg-red-600 px-3 py-1 rounded-full">
              🚨 {groupData?.activeSOS} active SOS
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Participants:</span>
                    <span className="font-bold">{groupData?.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-bold text-green-400">${groupData?.totalExpenses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Expenses:</span>
                    <span className="font-bold text-yellow-400">{groupData?.pendingExpenses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active SOS:</span>
                    <span className="font-bold text-red-400">{groupData?.activeSOS}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {groupData?.recentActivities?.map((activity, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      <span className="text-blue-400">{activity.time}</span> - {activity.message}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('expenses')}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    💰 Add Expense
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    ✅ Check Attendance
                  </button>
                  <button 
                    onClick={() => setActiveTab('sos')}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    🚨 SOS Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <ExpenseManager 
              groupId={groupId} 
              isOrganizer={isOrganizer}
              onUpdate={fetchGroupDashboard}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker 
              groupId={groupId} 
              isOrganizer={isOrganizer}
              onUpdate={fetchGroupDashboard}
            />
          )}

          {activeTab === 'sos' && (
            <SOSManager 
              groupId={groupId} 
              isOrganizer={isOrganizer}
              onUpdate={fetchGroupDashboard}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementBoard 
              groupId={groupId} 
              isOrganizer={isOrganizer}
              onUpdate={fetchGroupDashboard}
            />
          )}

          {activeTab === 'organizers' && isOrganizer && (
            <OrganizerManager 
              groupId={groupId}
              onUpdate={fetchGroupDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupTravelDashboard;
