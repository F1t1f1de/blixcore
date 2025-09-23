'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Download,
  Upload,
  Mail,
  MapPin,
  Activity,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Clock,
  Award,
  X
} from 'lucide-react';

// Types for fitness leads
interface FitnessLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  
  // Fitness Profile
  fitness_goals: string[];
  current_activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  previous_gym_experience: boolean;
  preferred_workout_types: string[];
  health_conditions: string[];
  budget_range: string;
  preferred_contact_method: 'email' | 'phone' | 'text';
  preferred_workout_times: string[];
  
  // Lead Management
  lead_source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  contacted_at?: string;
  converted_at?: string;
  created_at: string;
  updated_at: string;
  
  // Engagement
  last_activity?: string;
  total_activities: number;
}

interface LeadFilters {
  search: string;
  status: string;
  score_range: [number, number];
  fitness_goals: string[];
  activity_level: string;
  lead_source: string;
  budget_range: string;
  date_range: string;
}

const mockLeads: FitnessLead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+61 400 123 456',
    location: 'Sydney, NSW',
    age: 28,
    gender: 'female',
    fitness_goals: ['weight_loss', 'general_fitness'],
    current_activity_level: 'lightly_active',
    previous_gym_experience: false,
    preferred_workout_types: ['cardio', 'group_classes'],
    health_conditions: [],
    budget_range: '$100-150/week',
    preferred_contact_method: 'email',
    preferred_workout_times: ['morning', 'weekend'],
    lead_source: 'Website',
    score: 92,
    status: 'new',
    notes: 'Very motivated, looking to start ASAP',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_activity: '2 hours ago',
    total_activities: 5
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+61 400 987 654',
    location: 'Melbourne, VIC',
    age: 35,
    gender: 'male',
    fitness_goals: ['muscle_gain', 'strength'],
    current_activity_level: 'moderately_active',
    previous_gym_experience: true,
    preferred_workout_types: ['weight_training', 'personal_training'],
    health_conditions: ['lower_back_issues'],
    budget_range: '$200+/week',
    preferred_contact_method: 'phone',
    preferred_workout_times: ['evening', 'weekday'],
    lead_source: 'Facebook Ad',
    score: 85,
    status: 'contacted',
    notes: 'Experienced lifter, needs specialized program',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    last_activity: '1 day ago',
    total_activities: 8
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    phone: '+61 400 555 789',
    location: 'Brisbane, QLD',
    age: 42,
    gender: 'female',
    fitness_goals: ['flexibility', 'stress_relief'],
    current_activity_level: 'sedentary',
    previous_gym_experience: false,
    preferred_workout_types: ['yoga', 'pilates'],
    health_conditions: ['anxiety', 'joint_pain'],
    budget_range: '$80-120/week',
    preferred_contact_method: 'text',
    preferred_workout_times: ['afternoon', 'weekend'],
    lead_source: 'Referral',
    score: 78,
    status: 'qualified',
    notes: 'Needs gentle introduction, focus on mental health benefits',
    created_at: '2024-01-13T16:45:00Z',
    updated_at: '2024-01-15T11:30:00Z',
    last_activity: '3 hours ago',
    total_activities: 12
  }
];


const activityLevels = [
  'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
];

const leadSources = [
  'Website', 'Facebook Ad', 'Instagram', 'Google Ads', 'Referral', 'Gym Visit', 'Partner'
];

export default function LeadManagement() {
  const [leads] = useState<FitnessLead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<FitnessLead[]>(mockLeads);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'activity'>('score');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: 'all',
    score_range: [0, 100],
    fitness_goals: [],
    activity_level: 'all',
    lead_source: 'all',
    budget_range: 'all',
    date_range: 'all'
  });

  // Import/Export state
  const [showImportModal, setShowImportModal] = useState(false);

  // CSV Export function
  const handleExport = () => {
    const csvHeaders = [
      'Name', 'Email', 'Phone', 'Age', 'Gender', 'Location',
      'Fitness Goals', 'Activity Level', 'Budget Range', 'Lead Score',
      'Lead Source', 'Status', 'Created Date'
    ];

    const csvData = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.age || '',
      lead.gender || '',
      lead.location || '',
      lead.fitness_goals.join('; '),
      lead.current_activity_level,
      lead.budget_range,
      lead.score,
      lead.lead_source,
      lead.status,
      new Date(lead.created_at).toLocaleDateString()
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import function
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      // This would be implemented to parse CSV and add to leads
      console.log('CSV Import data:', csvData);
      // For now, just show success message
      alert('Import functionality would be implemented here with proper CSV parsing and validation');
    };
    reader.readAsText(file);
    setShowImportModal(false);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...leads];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(filters.search)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Score range filter
    filtered = filtered.filter(lead => 
      lead.score >= filters.score_range[0] && lead.score <= filters.score_range[1]
    );

    // Fitness goals filter
    if (filters.fitness_goals.length > 0) {
      filtered = filtered.filter(lead =>
        filters.fitness_goals.some(goal => lead.fitness_goals.includes(goal))
      );
    }

    // Activity level filter
    if (filters.activity_level !== 'all') {
      filtered = filtered.filter(lead => lead.current_activity_level === filters.activity_level);
    }

    // Lead source filter
    if (filters.lead_source !== 'all') {
      filtered = filtered.filter(lead => lead.lead_source === filters.lead_source);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'activity':
          aValue = a.total_activities;
          bValue = b.total_activities;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, filters, sortBy, sortOrder]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-100';
    if (score >= 80) return 'text-blue-700 bg-blue-100';
    if (score >= 70) return 'text-yellow-700 bg-yellow-100';
    if (score >= 60) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const selectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your fitness business prospects
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              />
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'activity')}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              >
                <option value="score">Lead Score</option>
                <option value="date">Date Added</option>
                <option value="activity">Last Activity</option>
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg border ${
                showFilters ? 'bg-[#00e0ff] text-white border-[#00e0ff]' : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-[#00e0ff] text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 ${viewMode === 'cards' ? 'bg-[#00e0ff] text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <select
                  value={filters.activity_level}
                  onChange={(e) => setFilters(prev => ({ ...prev, activity_level: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                >
                  <option value="all">All Levels</option>
                  {activityLevels.map(level => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                <select
                  value={filters.lead_source}
                  onChange={(e) => setFilters(prev => ({ ...prev, lead_source: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                >
                  <option value="all">All Sources</option>
                  {leadSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.score_range[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      score_range: [prev.score_range[0], parseInt(e.target.value)] 
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{filters.score_range[1]}+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredLeads.length} of {leads.length} leads
          {selectedLeads.length > 0 && (
            <span className="ml-2 text-[#00e0ff]">
              ({selectedLeads.length} selected)
            </span>
          )}
        </div>

        {selectedLeads.length > 0 && (
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Leads Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={selectAllLeads}
                      className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fitness Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00e0ff] to-[#001f3f] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          {lead.phone && (
                            <div className="text-xs text-gray-400">{lead.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.fitness_goals.slice(0, 2).map(goal => 
                          goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        ).join(', ')}
                        {lead.fitness_goals.length > 2 && ` +${lead.fitness_goals.length - 2}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.current_activity_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)}`}>
                        <Award className="h-3 w-3 mr-1" />
                        {lead.score}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.lead_source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.last_activity}</div>
                      <div className="text-xs text-gray-500">{lead.total_activities} activities</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-[#00e0ff] hover:text-[#001f3f]">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#00e0ff] to-[#001f3f] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => toggleLeadSelection(lead.id)}
                  className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)}`}>
                    <Award className="h-3 w-3 mr-1" />
                    Score: {lead.score}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Fitness Goals:</p>
                  <p className="text-sm text-gray-600">
                    {lead.fitness_goals.slice(0, 2).map(goal => 
                      goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    ).join(', ')}
                    {lead.fitness_goals.length > 2 && ` +${lead.fitness_goals.length - 2} more`}
                  </p>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Activity className="h-4 w-4 mr-2" />
                  {lead.current_activity_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>

                {lead.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {lead.location}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Last activity: {lead.last_activity}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Source: {lead.lead_source}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="text-[#00e0ff] hover:text-[#001f3f]">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredLeads.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or add some new leads to get started.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-[#00e0ff] text-white rounded-lg hover:bg-[#00e0ff]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Lead
          </button>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Leads</h3>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a CSV file with lead data. The file should include columns for:
                    Name, Email, Phone, Age, Gender, Location, Fitness Goals, Activity Level, Budget Range, Lead Source
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-[#00e0ff] hover:text-[#00e0ff]/80 font-medium">Choose a CSV file</span>
                      <span> or drag and drop</span>
                    </label>
                    <input 
                      id="csv-upload" 
                      type="file" 
                      accept=".csv"
                      onChange={handleImport}
                      className="sr-only" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CSV files only, up to 10MB</p>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <button 
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Generate and download CSV template
                      const templateHeaders = 'Name,Email,Phone,Age,Gender,Location,Fitness Goals,Activity Level,Budget Range,Lead Source';
                      const blob = new Blob([templateHeaders], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      const url = URL.createObjectURL(blob);
                      link.setAttribute('href', url);
                      link.setAttribute('download', 'leads-template.csv');
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#00e0ff] bg-[#00e0ff]/10 rounded-lg hover:bg-[#00e0ff]/20"
                  >
                    Download Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}