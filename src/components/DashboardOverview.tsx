'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Target,
  Plus,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  TrendingUp,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  fitness_goals: string[];
  current_activity_level: string;
  previous_gym_experience: boolean;
  budget_range: string;
  lead_source: string;
  status: string;
  created_at: string;
}

// Simple scoring function
function calculateLeadScore(lead: Lead): number {
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
  else score += 15;

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

export default function DashboardOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate real metrics from actual data
  const totalLeads = leads.length;
  const enhancedLeads = leads.map(lead => ({
    ...lead,
    aiScore: calculateLeadScore(lead)
  }));

  const hotLeads = enhancedLeads.filter(l => l.aiScore >= 85).length;
  const qualifiedLeads = enhancedLeads.filter(l => l.aiScore >= 70).length;
  const avgScore = totalLeads > 0 ? Math.round(enhancedLeads.reduce((sum, l) => sum + l.aiScore, 0) / totalLeads) : 0;
  const newLeads = leads.filter(l => l.status === 'new').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your fitness business leads with AI-powered insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/leads"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Live Data
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
            <p className="text-sm text-gray-500">Total Leads</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              AI Scored
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{hotLeads}</h3>
            <p className="text-sm text-gray-500">Hot Leads (85+)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Qualified
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{qualifiedLeads}</h3>
            <p className="text-sm text-gray-500">Qualified (70+)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Brain className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI Average
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{avgScore}</h3>
            <p className="text-sm text-gray-500">Avg Score</p>
          </div>
        </div>
      </div>

      {totalLeads === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first fitness lead</p>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Lead
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
                <Link 
                  href="/dashboard/leads"
                  className="text-sm text-[#00e0ff] hover:text-[#001f3f] font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {enhancedLeads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(lead.aiScore)}`}>
                          {lead.aiScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Goals: {lead.fitness_goals.slice(0, 2).join(', ')}</span>
                        <span>Source: {lead.lead_source}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Lead Quality</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Hot Leads (85+)</span>
                  <span className="text-sm text-red-600 font-bold">{hotLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Qualified (70+)</span>
                  <span className="text-sm text-orange-600 font-bold">{qualifiedLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">New Leads</span>
                  <span className="text-sm text-blue-600 font-bold">{newLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Average Score</span>
                  <span className="text-sm text-green-600 font-bold">{avgScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}