import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  PieChart, 
  TrendingUp,
  Edit3,
  Trash2,
  Receipt,
  MapPin,
  Tag
} from 'lucide-react';
import axios from '../config/axiosConfig';

const ExpenseTracker = () => {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    // Fallback categories in case API fails
    'accommodation',
    'transportation', 
    'food',
    'entertainment',
    'shopping',
    'tours',
    'insurance',
    'visa',
    'health',
    'miscellaneous'
  ]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    paymentMethod: 'cash',
    tags: '',
    notes: ''
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 20
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});

  // API calls - Define these first before useEffect hooks
  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/api/expenses/categories');
      console.log('Categories response:', response.data);
      
      if (response.data.success && response.data.categories) {
        setCategories(response.data.categories);
        console.log('Categories updated from API:', response.data.categories);
      } else {
        console.warn('API response missing categories, using fallback');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.log('Using fallback categories due to API error');
      // Keep the fallback categories that were set in initial state
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/expenses?${params.toString()}`);
      setExpenses(response.data.expenses || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        setError('Please log in to view your expenses');
      } else {
        setError('Failed to fetch expenses');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses/summary');
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated for summary');
      }
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchSummary()
      ]);
    };
    fetchInitialData();
  }, [fetchCategories, fetchExpenses, fetchSummary]);

  // Fetch expenses when filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      console.log('Submitting expense data:', expenseData);
      const response = await axios.post('/api/expenses', expenseData);
      console.log('Add expense response:', response.data);
      
      if (response.data.success) {
        setShowAddForm(false);
        resetForm();
        fetchExpenses();
        fetchSummary();
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || `Failed to add expense: ${error.response.status}`);
      } else if (error.request) {
        setError('Network error - please check your connection');
      } else {
        setError('Failed to add expense - please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      const response = await axios.put(`/api/expenses/${editingExpense.expenseID}`, updateData);
      
      if (response.data.success) {
        setEditingExpense(null);
        resetForm();
        fetchExpenses();
        fetchSummary();
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseID) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/expenses/${expenseID}`);
      
      if (response.data.success) {
        fetchExpenses();
        fetchSummary();
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('Failed to delete expense');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/expenses/search?q=${encodeURIComponent(searchTerm)}`);
      setExpenses(response.data.expenses || []);
    } catch {
      setError('Failed to search expenses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      subcategory: '',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      description: '',
      location: '',
      paymentMethod: 'cash',
      tags: '',
      notes: ''
    });
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      subcategory: expense.subcategory || '',
      amount: expense.amount.toString(),
      currency: expense.currency,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description,
      location: expense.location || '',
      paymentMethod: expense.paymentMethod,
      tags: expense.tags ? expense.tags.join(', ') : '',
      notes: expense.notes || ''
    });
    setShowAddForm(true);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      accommodation: '🏨',
      transportation: '🚗',
      food: '🍽️',
      entertainment: '🎭',
      shopping: '🛍️',
      tours: '🗺️',
      insurance: '🛡️',
      visa: '📋',
      health: '⚕️',
      miscellaneous: '📦'
    };
    return icons[category] || '💰';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💵',
      card: '💳',
      digital_wallet: '📱',
      bank_transfer: '🏦',
      other: '💰'
    };
    return icons[method] || '💰';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-200 flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              Expense Tracker
            </h1>
            <p className="text-gray-200 mt-1">Track and manage your travel expenses</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingExpense(null);
                resetForm();
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-200">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-200">
                  {formatCurrency(summary.overview.totalAmount || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-200">Total Entries</p>
                <p className="text-2xl font-bold text-gray-200">
                  {summary.overview.totalExpenses || 0}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-200">Average Expense</p>
                <p className="text-2xl font-bold text-gray-200">
                  {formatCurrency(summary.overview.avgExpense || 0)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-200">Highest Expense</p>
                <p className="text-2xl font-bold text-gray-200">
                  {formatCurrency(summary.overview.maxExpense || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search expenses by description, tags, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-600">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              className="px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              className="px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-gray-200">
            Recent Expenses ({pagination.totalExpenses || 0})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-200">Loading expenses...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Expenses Found</h3>
            <p className="text-gray-200">Start tracking your expenses by adding your first entry.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-600">
            {expenses.map((expense) => (
              <div key={expense.expenseID} className="p-6 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">
                      {getCategoryIcon(expense.category)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-200">
                        {expense.description}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-200">
                        <span className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </span>
                        
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(expense.date)}
                        </span>
                        
                        {expense.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {expense.location}
                          </span>
                        )}
                        
                        <span className="flex items-center">
                          <span className="mr-1">{getPaymentMethodIcon(expense.paymentMethod)}</span>
                          {expense.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {expense.tags && expense.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {expense.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {expense.notes && (
                        <p className="text-sm text-gray-200 mt-2">{expense.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-200">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteExpense(expense.expenseID)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-600 flex items-center justify-between">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-200">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-gray-200">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
            </div>
            
            <form onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Hotel, Gas, Restaurant"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="BDT">BDT</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="digital_wallet">Digital Wallet</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What was this expense for?"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Where did you spend this?"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma-separated tags (e.g., business, vacation, urgent)"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes about this expense..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-200 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
