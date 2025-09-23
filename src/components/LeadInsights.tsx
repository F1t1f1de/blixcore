'use client';

import { useState, useEffect } from 'react';
import { 
  calculateLeadScore, 
  type LeadScoringData,
  getScoreColor,
  getScoreLabel,
  getScoreIcon
} from '@/lib/leadScoring';
import {
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Activity,
  Zap,
  Brain,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';

interface LeadInsightsProps {
  leadData: LeadScoringData;
  onRecommendationAction?: (action: string, leadId?: string) => void;
}

export default function LeadInsights({ leadData, onRecommendationAction }: LeadInsightsProps) {
  const [scoring, setScoring] = useState<ReturnType<typeof calculateLeadScore> | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  useEffect(() => {
    const result = calculateLeadScore(leadData);
    setScoring(result);
  }, [leadData]);

  if (!scoring) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const { totalScore, breakdown, recommendations, insights } = scoring;
  const scoreColor = getScoreColor(totalScore);
  const scoreLabel = getScoreLabel(totalScore);
  const scoreIcon = getScoreIcon(totalScore);

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Lead Intelligence</h3>
              <p className="text-sm text-gray-600">Real-time fitness market analysis</p>
            </div>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            {showBreakdown ? 'Hide' : 'Show'} Breakdown
            <ChevronRight className={`h-4 w-4 ml-1 transform ${showBreakdown ? 'rotate-90' : ''} transition-transform`} />
          </button>
        </div>

        {/* Score Visualization */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-6 py-4 rounded-2xl border-2 ${scoreColor} mb-4`}>
            <span className="text-3xl mr-3">{scoreIcon}</span>
            <div className="text-left">
              <div className="text-3xl font-bold">{totalScore}</div>
              <div className="text-sm font-medium uppercase tracking-wide">{scoreLabel} LEAD</div>
            </div>
          </div>
          
          {/* Score Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                totalScore >= 85 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                totalScore >= 70 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                totalScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                totalScore >= 30 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                'bg-gradient-to-r from-gray-400 to-gray-500'
              }`}
              style={{ width: `${totalScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">AI Conversion Probability: {totalScore}%</p>
        </div>

        {/* Score Breakdown */}
        {showBreakdown && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-600">{breakdown.demographics}</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">Demographics</p>
              <p className="text-xs text-blue-600 mt-1">Age, location, profile</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-600">{breakdown.fitnessInterest}</span>
              </div>
              <p className="text-sm text-green-700 mt-1">Fitness Interest</p>
              <p className="text-xs text-green-600 mt-1">Goals, experience, signals</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-purple-600">{breakdown.engagement}</span>
              </div>
              <p className="text-sm text-purple-700 mt-1">Engagement</p>
              <p className="text-xs text-purple-600 mt-1">Email, website, activity</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-semibold text-orange-600">{breakdown.purchaseIntent}</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">Purchase Intent</p>
              <p className="text-xs text-orange-600 mt-1">Pricing, demos, budget</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-red-600" />
                <span className="text-lg font-semibold text-red-600">{breakdown.urgency}</span>
              </div>
              <p className="text-sm text-red-700 mt-1">Urgency</p>
              <p className="text-xs text-red-600 mt-1">Timeline, keywords</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span className="text-lg font-semibold text-indigo-600">{breakdown.marketFactors}</span>
              </div>
              <p className="text-sm text-indigo-700 mt-1">Market Factors</p>
              <p className="text-xs text-indigo-600 mt-1">Season, source, trends</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">AI Insights</h4>
        </div>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {index === 0 ? (
                  <Star className="h-4 w-4 text-blue-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-blue-800">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Smart Recommendations</h4>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            AI-Powered
          </span>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {index === 0 ? (
                    <AlertCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-green-800">{recommendation}</p>
              </div>
              
              <button
                onClick={() => onRecommendationAction?.(recommendation)}
                className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#00e0ff] to-blue-500 rounded-xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4">Recommended Next Steps</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {totalScore >= 70 && (
            <button
              onClick={() => onRecommendationAction?.('contact_immediately')}
              className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all"
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Contact Now</span>
            </button>
          )}
          
          <button
            onClick={() => onRecommendationAction?.('send_personalized_email')}
            className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Send Personal Email</span>
          </button>
          
          <button
            onClick={() => onRecommendationAction?.('add_to_nurture')}
            className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Add to Nurture</span>
          </button>
          
          <button
            onClick={() => onRecommendationAction?.('schedule_demo')}
            className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all"
          >
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Schedule Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}