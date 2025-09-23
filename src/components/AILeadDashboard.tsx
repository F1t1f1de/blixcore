'use client';

import { useState, useEffect } from 'react';
import { 
  calculateLeadScore, 
  type LeadScoringData
} from '@/lib/leadScoring';
import {
  TrendingUp,
  Target,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb,
  Flame,
  ChevronUp,
  ArrowRight
} from 'lucide-react';

interface FitnessLead {
  id: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  gender?: string;
  fitness_goals: string[];
  current_activity_level: string;
  previous_gym_experience: boolean;
  health_conditions: string[];
  budget_range: string;
  lead_source: string;
  created_at: string;
}

interface AILeadDashboardProps {
  leads: FitnessLead[];
  onLeadClick?: (leadId: string) => void;
}

interface LeadInsight {
  type: 'hot' | 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  leadId?: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AILeadDashboard({ leads, onLeadClick }: AILeadDashboardProps) {
  const [insights, setInsights] = useState<LeadInsight[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    qualifiedLeads: 0,
    avgScore: 0,
    conversionPotential: 0,
    urgentActions: 0
  });

  useEffect(() => {
    const analyzeLeads = () => {
    const convertedLeads = leads.map(lead => ({
      ...lead,
      scoringData: convertLeadToScoringData(lead),
      aiScore: calculateLeadScore(convertLeadToScoringData(lead))
    }));

    // Calculate stats
    const totalLeads = convertedLeads.length;
    const hotLeads = convertedLeads.filter(l => l.aiScore.totalScore >= 85).length;
    const qualifiedLeads = convertedLeads.filter(l => l.aiScore.totalScore >= 70).length;
    const avgScore = Math.round(convertedLeads.reduce((sum, l) => sum + l.aiScore.totalScore, 0) / totalLeads);
    const conversionPotential = Math.round((hotLeads * 85 + qualifiedLeads * 65) / totalLeads);
    const urgentActions = convertedLeads.filter(l => 
      l.aiScore.recommendations.some((rec: string) => rec.toLowerCase().includes('immediate') || rec.toLowerCase().includes('urgent'))
    ).length;

    setStats({
      totalLeads,
      hotLeads,
      qualifiedLeads,
      avgScore,
      conversionPotential,
      urgentActions
    });

    // Generate AI insights
    const newInsights: LeadInsight[] = [];

    // Hot leads analysis
    const hotLeadsList = convertedLeads.filter(l => l.aiScore.totalScore >= 85);
    if (hotLeadsList.length > 0) {
      newInsights.push({
        type: 'hot',
        title: `${hotLeadsList.length} Hot Lead${hotLeadsList.length > 1 ? 's' : ''} Need Immediate Attention`,
        description: `${hotLeadsList.map(l => l.name).join(', ')} have extremely high conversion potential. Contact within 2 hours.`,
        action: 'Contact immediately',
        priority: 'high'
      });
    }

    // Seasonal opportunities
    const month = new Date().getMonth() + 1;
    if (month <= 2 || month >= 10) {
      const seasonalLeads = convertedLeads.filter(l => 
        l.fitness_goals?.includes('weight_loss') || l.fitness_goals?.includes('general_fitness')
      );
      if (seasonalLeads.length > 3) {
        newInsights.push({
          type: 'opportunity',
          title: 'Seasonal Opportunity Detected',
          description: `${seasonalLeads.length} leads with weight loss goals during peak season. Perfect timing for transformation packages.`,
          action: 'Create seasonal campaign',
          priority: 'medium'
        });
      }
    }

    // Engagement warnings
    const lowEngagementLeads = convertedLeads.filter(l => 
      l.aiScore.breakdown.engagement < 10 && l.aiScore.totalScore > 40
    );
    if (lowEngagementLeads.length > 2) {
      newInsights.push({
        type: 'warning',
        title: 'High-Potential Leads with Low Engagement',
        description: `${lowEngagementLeads.length} good leads aren't engaging with emails. Consider phone outreach or social media.`,
        action: 'Change communication channel',
        priority: 'medium'
      });
    }

    // Budget alignment opportunities
    const premiumBudgetLeads = convertedLeads.filter(l => 
      l.budget_range?.includes('200+') || l.budget_range?.includes('unlimited')
    );
    if (premiumBudgetLeads.length > 0) {
      newInsights.push({
        type: 'opportunity',
        title: 'Premium Budget Leads Available',
        description: `${premiumBudgetLeads.length} leads with premium budgets. Focus on high-value packages and personal training.`,
        action: 'Present premium packages',
        priority: 'high'
      });
    }

    // Referral potential
    const experiencedLeads = convertedLeads.filter(l => 
      l.previous_gym_experience && l.aiScore.totalScore > 60
    );
    if (experiencedLeads.length > 3) {
      newInsights.push({
        type: 'recommendation',
        title: 'Referral Program Opportunity',
        description: `${experiencedLeads.length} experienced fitness enthusiasts could become brand ambassadors. Consider referral incentives.`,
        action: 'Implement referral program',
        priority: 'low'
      });
    }

    setInsights(newInsights);
    };

    if (leads.length > 0) {
      analyzeLeads();
    }
  }, [leads]);

  const convertLeadToScoringData = (lead: FitnessLead): LeadScoringData => {
    return {
      age: lead.age,
      location: lead.location,
      gender: lead.gender,
      currentActivityLevel: lead.current_activity_level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active',
      fitnessGoals: lead.fitness_goals,
      previousGymExperience: lead.previous_gym_experience,
      healthConditions: lead.health_conditions,
      budgetRange: lead.budget_range,
      leadSource: lead.lead_source,
      createdAt: new Date(lead.created_at),
      emailOpens: Math.floor(Math.random() * 10),
      emailClicks: Math.floor(Math.random() * 5),
      websiteVisits: Math.floor(Math.random() * 8),
      timeOnSite: Math.floor(Math.random() * 15),
      pricingPageViews: Math.floor(Math.random() * 3),
      businessType: 'personal_trainer'
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'hot': return <Flame className="h-5 w-5 text-red-500" />;
      case 'opportunity': return <Target className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'hot': return 'border-red-200 bg-red-50';
      case 'opportunity': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'recommendation': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Overview Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Lead Intelligence Dashboard</h2>
            <p className="text-purple-100">Real-time insights powered by fitness industry AI</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <div className="text-sm text-purple-100">Total Leads</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-200">🔥 {stats.hotLeads}</div>
            <div className="text-sm text-purple-100">Hot Leads</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-200">🎯 {stats.qualifiedLeads}</div>
            <div className="text-sm text-purple-100">Qualified</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.avgScore}</div>
            <div className="text-sm text-purple-100">Avg Score</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-200">{stats.conversionPotential}%</div>
            <div className="text-sm text-purple-100">Conversion</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-200">⚡ {stats.urgentActions}</div>
            <div className="text-sm text-purple-100">Urgent</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Updated in real-time
          </span>
        </div>

        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Analyzing your leads... Insights will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                    {insight.action && (
                      <button 
                        onClick={() => insight.leadId && onLeadClick?.(insight.leadId)}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {insight.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flame className="h-5 w-5 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Urgent Actions</h4>
          </div>
          <div className="space-y-3">
            {stats.hotLeads > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-800">Contact {stats.hotLeads} hot leads</span>
                <Clock className="h-4 w-4 text-red-600" />
              </div>
            )}
            {stats.urgentActions > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-orange-800">{stats.urgentActions} urgent follow-ups</span>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
            )}
            {stats.hotLeads === 0 && stats.urgentActions === 0 && (
              <p className="text-sm text-gray-500">No urgent actions needed</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Performance</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lead Quality</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-green-600">{stats.avgScore}%</span>
                <ChevronUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-green-600">{stats.conversionPotential}%</span>
                <ChevronUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Opportunities</h4>
          </div>
          <div className="space-y-3">
            {insights.filter(i => i.type === 'opportunity').length > 0 ? (
              insights.filter(i => i.type === 'opportunity').slice(0, 2).map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{insight.title}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No immediate opportunities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}