import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseManager = ({ groupId, isOrganizer, onUpdate }) => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'food',
    receipt: null
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'transport', label: 'Transportation', icon: '🚗' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'activity', label: 'Activities', icon: '🎯' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/groups/${groupId}/expenses`,
        newExpense,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setExpenses([...expenses, response.data.data]);
        setNewExpense({ amount: '', description: '', category: 'food', receipt: null });
        setShowAddForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveExpense = async (expenseId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/groups/${groupId}/expenses/${expenseId}/approve`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        fetchExpenses();
        onUpdate();
      }
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📋';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Group Expenses</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          + Add Expense
        </button>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                rows="3"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Expense'}
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

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-400 text-lg">No expenses added yet</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                    <div>
                      <h4 className="font-semibold">{expense.description}</h4>
                      <p className="text-sm text-gray-400">
                        by {expense.submittedBy.name} • {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-2xl font-bold">${expense.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(expense.status)}`}>
                      {expense.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {isOrganizer && expense.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveExpense(expense.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleApproveExpense(expense.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      ❌ Reject
                    </button>
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

export default ExpenseManager;
