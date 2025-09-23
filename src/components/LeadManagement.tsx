'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Grid,
  List,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Brain,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

function calculateLeadScore(lead: FitnessLead): number {
  let score = 0;
  
  if (lead.age) {
    if (lead.age >= 25 && lead.age <= 45) score += 25;
    else if (lead.age >= 18 && lead.age <= 55) score += 20;
    else score += 15;
  } else score += 10;

  switch (lead.current_activity_level) {
    case 'sedentary': score += 20; break;
    case 'lightly_active': score += 18; break;
    case 'moderately_active': score += 15; break;
    case 'very_active': score += 12; break;
    case 'extremely_active': score += 10; break;
  }

  if (lead.previous_gym_experience) score += 10;
  else score += 15;

  if (lead.budget_range.includes('200+')) score += 20;
  else if (lead.budget_range.includes('150') || lead.budget_range.includes('100-200')) score += 15;
  else if (lead.budget_range.includes('100')) score += 12;
  else score += 8;

  if (lead.lead_source.toLowerCase().includes('referral')) score += 10;
  else if (lead.lead_source.toLowerCase().includes('organic') || lead.lead_source.toLowerCase().includes('website')) score += 8;
  else if (lead.lead_source.toLowerCase().includes('google')) score += 7;
  else score += 5;

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

function getScoreIcon(score: number): string {
  if (score >= 85) return '🔥';
  if (score >= 70) return '🎯';
  if (score >= 50) return '⚡';
  if (score >= 30) return '🌱';
  return '❄️';
}

export default function LeadManagement() {
  const [leads, setLeads] = useState<FitnessLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<FitnessLead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [selectedLead, setSelectedLead] = useState<FitnessLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('fitness_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData: Partial<FitnessLead>) => {
    try {
      // Type assertion to bypass Supabase typing issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('fitness_leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;
      
      const newLeads = [data, ...leads];
      setLeads(newLeads);
      setFilteredLeads(newLeads);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fitness_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const newLeads = leads.filter(lead => lead.id !== id);
      setLeads(newLeads);
      setFilteredLeads(newLeads);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const enhancedLeads = filteredLeads.map(lead => ({
    ...lead,
    aiScore: calculateLeadScore(lead)
  }));

  useEffect(() => {
    let filtered = leads;
    
    if (searchTerm) {
      filtered = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    filtered.sort((a, b) => calculateLeadScore(b) - calculateLeadScore(a));
    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

  const stats = {
    total: enhancedLeads.length,
    hot: enhancedLeads.filter(l => l.aiScore >= 85).length,
    qualified: enhancedLeads.filter(l => l.aiScore >= 70).length,
    avgScore: enhancedLeads.length > 0 ? Math.round(enhancedLeads.reduce((sum, l) => sum + l.aiScore, 0) / enhancedLeads.length) : 0,
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-xl p-6 border">
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Dashboard */}
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
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">AI-powered fitness lead scoring and management</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
          >
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

      {/* Leads Display */}
      {enhancedLeads.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first fitness lead</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Lead
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
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
                {enhancedLeads.map((lead) => {
                  const scoreColor = getScoreColor(lead.aiScore);
                  const scoreIcon = getScoreIcon(lead.aiScore);
                  
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
                            {lead.aiScore}
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
                          <button 
                            onClick={() => deleteLead(lead.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedLeads.map((lead) => {
            const scoreColor = getScoreColor(lead.aiScore);
            const scoreIcon = getScoreIcon(lead.aiScore);
            
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
                        {lead.aiScore}
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
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
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
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Lead Form Modal */}
      {showAddForm && (
        <AddLeadForm
          onClose={() => setShowAddForm(false)}
          onAdd={addLead}
        />
      )}
    </div>
  );
}

// Add Lead Form Component
function AddLeadForm({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Partial<FitnessLead>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    age: '',
    fitness_goals: [] as string[],
    current_activity_level: 'sedentary',
    previous_gym_experience: false,
    budget_range: '',
    lead_source: '',
    status: 'new'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      current_activity_level: formData.current_activity_level as FitnessLead['current_activity_level'],
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      fitness_goals: prev.fitness_goals.includes(goal)
        ? prev.fitness_goals.filter(g => g !== goal)
        : [...prev.fitness_goals, goal]
    }));
  };

  const goals = ['weight_loss', 'muscle_gain', 'general_fitness', 'strength', 'flexibility', 'cardio'];
  const budgets = ['$50-100/week', '$100-150/week', '$150-200/week', '$200+/week'];
  const sources = ['Website', 'Google Search', 'Facebook Ad', 'Instagram', 'Referral', 'Walk-in'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
            />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
            />
          </div>

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goals</label>
            <div className="flex flex-wrap gap-2">
              {goals.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.fitness_goals.includes(goal)
                      ? 'bg-[#00e0ff] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select
                value={formData.current_activity_level}
                onChange={(e) => setFormData(prev => ({ ...prev, current_activity_level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              >
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
                <option value="extremely_active">Extremely Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={formData.budget_range}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              >
                <option value="">Select Budget</option>
                {budgets.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
            <select
              value={formData.lead_source}
              onChange={(e) => setFormData(prev => ({ ...prev, lead_source: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
            >
              <option value="">Select Source</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="experience"
              checked={formData.previous_gym_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, previous_gym_experience: e.target.checked }))}
              className="h-4 w-4 text-[#00e0ff] focus:ring-[#00e0ff] border-gray-300 rounded"
            />
            <label htmlFor="experience" className="ml-2 text-sm text-gray-700">
              Has previous gym experience
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}