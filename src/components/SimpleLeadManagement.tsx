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
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Brain,
  Target,
  TrendingUp,
  Award,
  X
} from 'lucide-react';

// Simplified lead type
interface FitnessLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  fitness_goals: string[];
  current_activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  previous_gym_experience: boolean;
  budget_range: string;
  lead_source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at: string;
}

// Simple scoring function that actually works
function calculateLeadScore(lead: FitnessLead): number {
  let score = 0;
  
  // Age scoring (0-25 points)
  if (lead.age) {
    if (lead.age >= 25 && lead.age <= 45) score += 25;
    else if (lead.age >= 18 && lead.age <= 55) score += 20;
    else score += 15;
  } else score += 10;

  // Activity level (0-20 points) - sedentary has highest potential
  switch (lead.current_activity_level) {
    case 'sedentary': score += 20; break;
    case 'lightly_active': score += 18; break;
    case 'moderately_active': score += 15; break;
    case 'very_active': score += 12; break;
    case 'extremely_active': score += 10; break;
  }

  // Experience (0-15 points)
  if (lead.previous_gym_experience) score += 10;
  else score += 15; // New to gym = higher potential

  // Budget (0-20 points)
  if (lead.budget_range.includes('200+')) score += 20;
  else if (lead.budget_range.includes('150') || lead.budget_range.includes('100-200')) score += 15;
  else if (lead.budget_range.includes('100')) score += 12;
  else score += 8;

  // Lead source (0-10 points)
  if (lead.lead_source.toLowerCase().includes('referral')) score += 10;
  else if (lead.lead_source.toLowerCase().includes('organic') || lead.lead_source.toLowerCase().includes('website')) score += 8;
  else if (lead.lead_source.toLowerCase().includes('google')) score += 7;
  else score += 5;

  // Goals (0-10 points)
  if (lead.fitness_goals.length > 0) score += Math.min(lead.fitness_goals.length * 3, 10);

  return Math.min(score, 100);
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-red-600 bg-red-50 border-red-200';
  if (score >= 70) return 'text-orange-600 bg-orange-50 border-orange-200';
  if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (score >= 30) return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'HOT';
  if (score >= 70) return 'QUALIFIED';
  if (score >= 50) return 'WARM';
  if (score >= 30) return 'DEVELOPING';
  return 'COLD';
}

function getScoreIcon(score: number): string {
  if (score >= 85) return '🔥';
  if (score >= 70) return '🎯';
  if (score >= 50) return '⚡';
  if (score >= 30) return '🌱';
  return '❄️';
}

// Mock leads with realistic data
const mockLeads: FitnessLead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+61 400 123 456',
    location: 'Bondi, NSW',
    age: 28,
    fitness_goals: ['weight_loss', 'general_fitness'],
    current_activity_level: 'sedentary',
    previous_gym_experience: false,
    budget_range: '$100-150/week',
    lead_source: 'Google Search',
    status: 'new',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+61 400 987 654',
    location: 'Toorak, VIC',
    age: 35,
    fitness_goals: ['muscle_gain', 'strength'],
    current_activity_level: 'lightly_active',
    previous_gym_experience: true,
    budget_range: '$200+/week',
    lead_source: 'Referral',
    status: 'contacted',
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    phone: '+61 400 555 789',
    location: 'Brisbane, QLD',
    age: 42,
    fitness_goals: ['flexibility', 'stress_relief'],
    current_activity_level: 'sedentary',
    previous_gym_experience: false,
    budget_range: '$80-120/week',
    lead_source: 'Facebook Ad',
    status: 'qualified',
    created_at: '2024-01-13T16:45:00Z'
  },
  {
    id: '4',
    name: 'James Thompson',
    email: 'james.t@email.com',
    phone: '+61 400 333 222',
    location: 'Perth, WA',
    age: 29,
    fitness_goals: ['weight_loss', 'cardio'],
    current_activity_level: 'sedentary',
    previous_gym_experience: false,
    budget_range: '$150-200/week',
    lead_source: 'Website',
    status: 'new',
    created_at: '2024-01-16T09:30:00Z'
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    phone: '+61 400 777 888',
    location: 'Adelaide, SA',
    age: 38,
    fitness_goals: ['general_fitness', 'strength'],
    current_activity_level: 'moderately_active',
    previous_gym_experience: true,
    budget_range: '$200+/week',
    lead_source: 'Referral',
    status: 'qualified',
    created_at: '2024-01-12T11:15:00Z'
  }
];

export default function SimpleLeadManagement() {
  const [leads] = useState<FitnessLead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<FitnessLead[]>(mockLeads);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [selectedLead, setSelectedLead] = useState<FitnessLead | null>(null);

  // Calculate enhanced leads with scores
  const enhancedLeads = leads.map(lead => ({
    ...lead,
    aiScore: calculateLeadScore(lead)
  }));

  // Filter leads based on search
  useEffect(() => {
    let filtered = enhancedLeads;
    
    if (searchTerm) {
      filtered = enhancedLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Sort by AI score (highest first)
    filtered.sort((a, b) => b.aiScore - a.aiScore);
    
    setFilteredLeads(filtered);
  }, [searchTerm]);

  // Calculate dashboard stats
  const stats = {
    total: enhancedLeads.length,
    hot: enhancedLeads.filter(l => l.aiScore >= 85).length,
    qualified: enhancedLeads.filter(l => l.aiScore >= 70).length,
    avgScore: Math.round(enhancedLeads.reduce((sum, l) => sum + l.aiScore, 0) / enhancedLeads.length),
    newLeads: enhancedLeads.filter(l => l.status === 'new').length
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

  const showLeadInsights = (lead: FitnessLead) => {
    setSelectedLead(lead);
    setShowInsights(true);
  };

  const getInsights = (lead: FitnessLead) => {
    const score = calculateLeadScore(lead);
    const insights = [];
    const recommendations = [];

    if (score >= 85) {
      insights.push('🔥 HOT LEAD - Extremely high conversion potential');
      recommendations.push('Contact immediately - within 2 hours');
      recommendations.push('Prepare premium package presentation');
    } else if (score >= 70) {
      insights.push('🎯 QUALIFIED LEAD - Strong conversion potential');
      recommendations.push('Contact within 24 hours');
      recommendations.push('Focus on value proposition');
    } else if (score >= 50) {
      insights.push('⚡ WARM LEAD - Good potential with nurturing');
      recommendations.push('Add to email nurture sequence');
      recommendations.push('Schedule follow-up in 3-5 days');
    } else {
      insights.push('🌱 DEVELOPING LEAD - Needs education and nurturing');
      recommendations.push('Send educational content first');
      recommendations.push('Long-term nurture approach');
    }

    // Specific insights based on data
    if (lead.current_activity_level === 'sedentary') {
      insights.push('💪 Sedentary lifestyle - huge transformation potential');
      recommendations.push('Emphasize beginner-friendly programs');
    }

    if (lead.budget_range.includes('200+')) {
      insights.push('💰 Premium budget - no price sensitivity');
      recommendations.push('Present top-tier packages');
    }

    if (!lead.previous_gym_experience) {
      insights.push('🌟 New to fitness - needs supportive approach');
      recommendations.push('Highlight beginner support and community');
    }

    if (lead.lead_source.toLowerCase().includes('referral')) {
      insights.push('👥 Referral lead - highest quality source');
      recommendations.push('Mention who referred them in outreach');
    }

    return { insights, recommendations };
  };

  return (
    <div className="space-y-6">
      {/* Simple AI Dashboard */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6" />
          <h2 className="text-xl font-semibold">AI Lead Intelligence</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Leads</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-200">🔥 {stats.hot}</div>
            <div className="text-sm text-blue-100">Hot</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-200">🎯 {stats.qualified}</div>
            <div className="text-sm text-blue-100">Qualified</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.avgScore}</div>
            <div className="text-sm text-blue-100">Avg Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-200">⚡ {stats.newLeads}</div>
            <div className="text-sm text-blue-100">New</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">AI-powered fitness lead scoring and insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
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
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md ${viewMode === 'cards' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table/Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals & Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => {
                  const score = calculateLeadScore(lead);
                  const scoreColor = getScoreColor(score);
                  const scoreIcon = getScoreIcon(score);
                  
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00e0ff] to-[#001f3f] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            {lead.phone && <div className="text-xs text-gray-400">{lead.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {lead.fitness_goals.slice(0, 2).map(goal => 
                            goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                          ).join(', ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.current_activity_level.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${scoreColor}`}>
                            <span className="mr-1">{scoreIcon}</span>
                            {score}
                          </div>
                          <button
                            onClick={() => showLeadInsights(lead)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View AI Insights"
                          >
                            <Brain className="h-4 w-4" />
                          </button>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-[#00e0ff] hover:text-[#001f3f]">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => {
            const score = calculateLeadScore(lead);
            const scoreColor = getScoreColor(score);
            const scoreIcon = getScoreIcon(score);
            
            return (
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
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${scoreColor}`}>
                        <span className="mr-1">{scoreIcon}</span>
                        {score}
                      </span>
                      <button
                        onClick={() => showLeadInsights(lead)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="AI Insights"
                      >
                        <Brain className="h-3 w-3" />
                      </button>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Goals:</p>
                    <p className="text-sm text-gray-600">
                      {lead.fitness_goals.map(goal => 
                        goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{lead.current_activity_level.replace('_', ' ')}</span>
                    <span>{lead.budget_range}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{lead.lead_source}</span>
                    <div className="flex items-center space-x-2">
                      <button className="text-[#00e0ff] hover:text-[#001f3f]">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-600">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights Modal */}
      {showInsights && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI Insights for {selectedLead.name}
                  </h3>
                  <p className="text-sm text-gray-600">Score: {calculateLeadScore(selectedLead)}/100</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {(() => {
              const { insights, recommendations } = getInsights(selectedLead);
              return (
                <div className="space-y-6">
                  {/* Insights */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h4>
                    <div className="space-y-2">
                      {insights.map((insight, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button 
                      onClick={() => setShowInsights(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90">
                      Take Action
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}