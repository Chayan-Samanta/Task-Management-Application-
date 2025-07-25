import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Trash2, Calendar, Filter, Search, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });

  const API_BASE = 'http://localhost:5000/api';

  // Utility function for API calls
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Load tasks and stats on component mount
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // Update filtered results when tasks, filter, or search term changes
  useEffect(() => {
    fetchStats();
  }, [tasks]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (searchTerm) params.append('search', searchTerm);

      const data = await apiCall(`${API_BASE}/tasks?${params}`);
      setTasks(data);
    } catch (error) {
      setError('Failed to fetch tasks. Using offline mode.');
      // Fallback to localStorage for demo
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiCall(`${API_BASE}/tasks/stats`);
      setStats(data);
    } catch (error) {
      // Calculate stats from local tasks if API fails
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;
      const today = new Date().toISOString().split('T')[0];
      const overdue = tasks.filter(t => t.dueDate && t.dueDate < today && !t.completed).length;
      
      setStats({ total, completed, pending, overdue });
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const taskData = {
        text: newTask.trim(),
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null,
      };

      const newTaskFromServer = await apiCall(`${API_BASE}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      setTasks(prev => [newTaskFromServer, ...prev]);
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      setError('');
    } catch (error) {
      setError('Failed to add task: ' + error.message);
      // Fallback to local storage
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [task, ...prev]);
      localStorage.setItem('tasks', JSON.stringify([task, ...tasks]));
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const updatedTask = await apiCall(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });

      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      setError('');
    } catch (error) {
      setError('Failed to update task: ' + error.message);
      // Fallback to local update
      const updatedTasks = tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiCall(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
      setError('');
    } catch (error) {
      setError('Failed to delete task: ' + error.message);
      // Fallback to local delete
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const updateData = {
        text: editText.trim(),
        priority: editPriority,
        dueDate: editDueDate || null,
      };

      const updatedTask = await apiCall(`${API_BASE}/tasks/${editingTask}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      setTasks(prev => prev.map(t => t.id === editingTask ? updatedTask : t));
      setEditingTask(null);
      setEditText('');
      setEditPriority('medium');
      setEditDueDate('');
      setError('');
    } catch (error) {
      setError('Failed to update task: ' + error.message);
      // Fallback to local update
      const updatedTasks = tasks.map(t => 
        t.id === editingTask ? { ...t, text: editText.trim(), priority: editPriority, dueDate: editDueDate || null } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setEditingTask(null);
      setEditText('');
      setEditPriority('medium');
      setEditDueDate('');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
    setEditPriority('medium');
    setEditDueDate('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={16} className="text-red-500" />;
      case 'medium': return <Clock size={16} className="text-yellow-500" />;
      case 'low': return <CheckCircle2 size={16} className="text-green-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'active' && !task.completed);
    
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Manager Pro</h1>
          <p className="text-gray-600">Stay organized and productive with smart task management</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-gray-600 text-sm">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.completed}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pending}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.overdue}</div>
            <div className="text-gray-600 text-sm">Overdue</div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-blue-600" />
            Add New Task
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task..."
                className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={addTask}
                disabled={!newTask.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <button
              onClick={fetchTasks}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Zap size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
            <span>Your Tasks ({filteredTasks.length})</span>
            {isLoading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
          </h2>
          
          {isLoading && tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p>{searchTerm || filter !== 'all' ? 'Try adjusting your filters or search term' : 'Add your first task above to get started!'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md animate-fade-in ${getPriorityColor(task.priority)} ${
                    task.completed ? 'opacity-75' : ''
                  } ${isOverdue(task) ? 'ring-2 ring-red-200' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 p-1 rounded-full transition-all flex-shrink-0 ${
                          task.completed
                            ? 'bg-green-600 text-white shadow-md'
                            : 'border-2 border-gray-300 hover:border-green-500 hover:bg-green-50'
                        }`}
                      >
                        {task.completed && <Check size={16} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        {editingTask === task.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            />
                            <div className="flex gap-2">
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                              >
                                <Check size={14} />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <span
                                className={`text-lg font-medium break-words ${
                                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                }`}
                              >
                                {task.text}
                              </span>
                              {isOverdue(task) && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              <div className="flex items-center gap-1">
                                {getPriorityIcon(task.priority)}
                                <span className="capitalize font-medium">{task.priority} Priority</span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span className={isOverdue(task) ? 'text-red-600 font-medium' : ''}>
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-gray-400">
                                Created {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {editingTask !== task.id && (
                      <div className="flex gap-1 flex-shrink-0">
                        {!task.completed && (
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Mark as completed"
                          >
                            <Check size={14} />
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p><span className='text-sm text-gray-500'>Hi i'm Chayan And Hear your <b className='text-gray-700'>Task Management Application</b> In Future i will add more feature in this application like Notifications, Reminders, Voice Speking Task, Controle With All Home Voice Assistance Devices and more.</span></p>
          <div className="text-sm text-gray-500">
            <p>All Right Reserved &copy; 2025</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TodoApp;