'use client';

import { useState } from 'react';
import {
  Users,
  Target,
  DollarSign,
  Plus,
  Mail,
  Calendar,
  Activity,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';

// Mock data for demo
const metrics = [
  {
    title: 'Total Leads',
    value: '247',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    period: 'This month',
    trend: [20, 25, 22, 30, 28, 35, 32, 40, 38, 42, 45, 47]
  },
  {
    title: 'Conversion Rate',
    value: '23.4%',
    change: '+5.2%',
    changeType: 'positive',
    icon: Target,
    period: 'This month',
    trend: [15, 18, 16, 22, 20, 25, 23, 28, 26, 30, 28, 32]
  },
  {
    title: 'Monthly Revenue',
    value: 'AU$12,450',
    change: '+18%',
    changeType: 'positive',
    icon: DollarSign,
    period: 'This month',
    trend: [800, 900, 850, 1100, 1000, 1200, 1150, 1300, 1250, 1400, 1350, 1450]
  },
  {
    title: 'Avg. Lead Score',
    value: '78',
    change: '-2%',
    changeType: 'negative',
    icon: Award,
    period: 'This month',
    trend: [82, 80, 85, 78, 79, 76, 78, 75, 77, 78, 76, 78]
  }
];

const recentLeads = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    score: 92,
    goal: 'Weight Loss',
    source: 'Website',
    time: '2 hours ago',
    status: 'new'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    score: 85,
    goal: 'Muscle Gain',
    source: 'Facebook Ad',
    time: '4 hours ago',
    status: 'contacted'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    score: 78,
    goal: 'General Fitness',
    source: 'Referral',
    time: '6 hours ago',
    status: 'qualified'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david.brown@email.com',
    score: 88,
    goal: 'Athletic Performance',
    source: 'Instagram',
    time: '1 day ago',
    status: 'new'
  },
  {
    id: 5,
    name: 'Lisa Zhang',
    email: 'lisa.zhang@email.com',
    score: 72,
    goal: 'Rehabilitation',
    source: 'Google Ads',
    time: '1 day ago',
    status: 'contacted'
  }
];

const scoreDistribution = [
  { range: '90-100', count: 45, percentage: 18 },
  { range: '80-89', count: 78, percentage: 32 },
  { range: '70-79', count: 62, percentage: 25 },
  { range: '60-69', count: 38, percentage: 15 },
  { range: '50-59', count: 24, percentage: 10 }
];

const quickActions = [
  {
    title: 'Add New Lead',
    description: 'Manually add a fitness prospect',
    icon: Plus,
    color: 'bg-[#00e0ff]',
    href: '/dashboard/leads/new'
  },
  {
    title: 'Create Campaign',
    description: 'Launch email or SMS campaign',
    icon: Mail,
    color: 'bg-purple-500',
    href: '/dashboard/campaigns/new'
  },
  {
    title: 'Schedule Follow-up',
    description: 'Set reminders for hot leads',
    icon: Calendar,
    color: 'bg-green-500',
    href: '/dashboard/leads?filter=followup'
  },
  {
    title: 'View Analytics',
    description: 'Detailed performance insights',
    icon: Activity,
    color: 'bg-orange-500',
    href: '/dashboard/analytics'
  }
];

const seasonalInsights = {
  season: 'Summer Prep Season',
  trend: 'High Activity',
  description: 'Peak season for fitness goals in Australia. Expect 40% more leads focused on weight loss and beach body preparation.',
  tips: [
    'Create summer-focused campaigns',
    'Highlight transformation stories',
    'Offer beach body bootcamps'
  ]
};

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState('30d');

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
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here&apos;s what&apos;s happening with your fitness business.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Seasonal Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{seasonalInsights.season}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {seasonalInsights.trend}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{seasonalInsights.description}</p>
            <div className="flex flex-wrap gap-2">
              {seasonalInsights.tips.map((tip, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-orange-200">
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-r from-[#00e0ff]/20 to-[#001f3f]/10 rounded-lg">
                <metric.icon className="h-5 w-5 text-[#00e0ff]" />
              </div>
              <div className={`flex items-center text-sm ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-500">{metric.title}</p>
            </div>
            <p className="text-xs text-gray-400">{metric.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
              <button className="text-sm text-[#00e0ff] hover:text-[#001f3f] font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{lead.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Goal: {lead.goal}</span>
                      <span>Source: {lead.source}</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {lead.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lead Score Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {scoreDistribution.map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">{item.range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="bg-gradient-to-r from-[#00e0ff] to-[#001f3f] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all text-left group"
            >
              <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}