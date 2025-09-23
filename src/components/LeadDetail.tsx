'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Activity,
  MessageSquare,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  User,
  Star,
  Plus,
  ExternalLink
} from 'lucide-react';

interface LeadDetailProps {
  leadId: string;
  onBack: () => void;
  onEdit: () => void;
}

// Mock lead data - in real app, this would come from props or API
const mockLead = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+61 400 123 456',
  location: 'Sydney, NSW',
  age: 28,
  gender: 'Female',
  
  // Fitness Profile
  fitness_goals: ['Weight Loss', 'General Fitness'],
  current_activity_level: 'Lightly Active',
  previous_gym_experience: false,
  preferred_workout_types: ['Cardio', 'Group Classes'],
  health_conditions: [],
  budget_range: '$100-150/week',
  preferred_contact_method: 'Email',
  preferred_workout_times: ['Morning', 'Weekend'],
  
  // Lead Management
  lead_source: 'Website',
  score: 92,
  status: 'new',
  notes: 'Very motivated, looking to start ASAP. Has tried dieting before but wants professional guidance with exercise.',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
  
  // Score Breakdown
  score_breakdown: {
    demographics: 20,
    fitness_interest: 25,
    engagement: 22,
    purchase_intent: 15,
    urgency: 10
  },
  
  // Activity Timeline
  activities: [
    {
      id: '1',
      type: 'form_submitted',
      title: 'Lead Form Submitted',
      description: 'Completed initial fitness assessment form',
      timestamp: '2024-01-15T10:30:00Z',
      icon: 'form'
    },
    {
      id: '2',
      type: 'website_visit',
      title: 'Website Visit',
      description: 'Viewed pricing page for 3 minutes',
      timestamp: '2024-01-15T10:25:00Z',
      icon: 'web'
    },
    {
      id: '3',
      type: 'email_opened',
      title: 'Email Opened',
      description: 'Opened welcome email from fitness team',
      timestamp: '2024-01-15T09:45:00Z',
      icon: 'email'
    },
    {
      id: '4',
      type: 'social_engagement',
      title: 'Social Media Engagement',
      description: 'Liked Instagram post about success stories',
      timestamp: '2024-01-14T16:20:00Z',
      icon: 'social'
    }
  ],
  
  // Tasks and Follow-ups
  tasks: [
    {
      id: '1',
      title: 'Send welcome email with program options',
      due_date: '2024-01-16T09:00:00Z',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Schedule initial consultation call',
      due_date: '2024-01-17T14:00:00Z',
      completed: false,
      priority: 'medium'
    }
  ]
};

export default function LeadDetail({ onBack, onEdit }: LeadDetailProps) {
  const [lead] = useState(mockLead);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'tasks' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'form_submitted': return <User className="h-4 w-4" />;
      case 'website_visit': return <ExternalLink className="h-4 w-4" />;
      case 'email_opened': return <Mail className="h-4 w-4" />;
      case 'phone_call': return <Phone className="h-4 w-4" />;
      case 'social_engagement': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-500">Lead Profile</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Lead Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lead Score</p>
              <p className="text-2xl font-bold text-gray-900">{lead.score}</p>
            </div>
            <div className={`p-3 rounded-lg ${getScoreColor(lead.score)}`}>
              <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              High conversion probability
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Created {formatDate(lead.created_at)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Source</p>
              <p className="text-lg font-semibold text-gray-900">{lead.lead_source}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
              <ExternalLink className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Budget: {lead.budget_range}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Method</p>
              <p className="text-lg font-semibold text-gray-900">{lead.preferred_contact_method}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-700">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Response time: 2-4 hours</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'timeline', label: 'Activity Timeline', icon: Clock },
            { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'activity' | 'tasks' | 'notes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-[#00e0ff] text-[#00e0ff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{lead.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{lead.age} years old, {lead.gender}</span>
              </div>
            </div>
          </div>

          {/* Fitness Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Goals</p>
                <div className="flex flex-wrap gap-2">
                  {lead.fitness_goals.map(goal => (
                    <span key={goal} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00e0ff]/10 text-[#001f3f]">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Activity Level</p>
                <p className="text-sm text-gray-600">{lead.current_activity_level}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Previous Experience</p>
                <p className="text-sm text-gray-600">{lead.previous_gym_experience ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Preferred Workouts</p>
                <p className="text-sm text-gray-600">{lead.preferred_workout_types.join(', ')}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Preferred Times</p>
                <p className="text-sm text-gray-600">{lead.preferred_workout_times.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Lead Score Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(lead.score_breakdown).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{score}/25</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#00e0ff] to-[#001f3f] h-2 rounded-full"
                      style={{ width: `${(score / 25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-[#00e0ff] bg-[#00e0ff]/10 rounded-lg hover:bg-[#00e0ff]/20">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </button>
          </div>
          
          <div className="flow-root">
            <ul className="-mb-8">
              {lead.activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== lead.activities.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00e0ff] text-white">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-[#00e0ff] bg-[#00e0ff]/10 rounded-lg hover:bg-[#00e0ff]/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>
            
            <div className="space-y-3">
              {lead.tasks.filter(task => !task.completed).map(task => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {formatDate(task.due_date)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{lead.notes}</p>
                <p className="text-xs text-gray-500 mt-2">Added {formatDate(lead.created_at)}</p>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                />
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90">
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}