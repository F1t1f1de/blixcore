'use client';

import { useState } from 'react';
import {
  User,
  Target,
  Heart,
  MessageSquare,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LeadFormData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  location: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  
  // Fitness Profile
  fitness_goals: string[];
  current_activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | '';
  previous_gym_experience: boolean | null;
  preferred_workout_types: string[];
  health_conditions: string[];
  dietary_restrictions: string[];
  budget_range: string;
  preferred_contact_method: 'email' | 'phone' | 'text' | '';
  preferred_workout_times: string[];
  
  // Lead Information
  lead_source: string;
  notes: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LeadFormData) => void;
  initialData?: Partial<LeadFormData>;
  mode: 'add' | 'edit';
}

const fitnessGoals = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'general_fitness', label: 'General Fitness' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardiovascular Health' },
  { value: 'flexibility', label: 'Flexibility & Mobility' },
  { value: 'athletic_performance', label: 'Athletic Performance' },
  { value: 'rehabilitation', label: 'Injury Rehabilitation' },
  { value: 'stress_relief', label: 'Stress Relief' },
  { value: 'body_composition', label: 'Body Composition' }
];

const workoutTypes = [
  { value: 'weight_training', label: 'Weight Training' },
  { value: 'cardio', label: 'Cardio/Running' },
  { value: 'group_classes', label: 'Group Fitness Classes' },
  { value: 'personal_training', label: 'Personal Training' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'functional_training', label: 'Functional Training' },
  { value: 'sports_specific', label: 'Sports-Specific Training' }
];

const healthConditions = [
  { value: 'heart_condition', label: 'Heart Condition' },
  { value: 'high_blood_pressure', label: 'High Blood Pressure' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'arthritis', label: 'Arthritis' },
  { value: 'back_pain', label: 'Back Pain/Issues' },
  { value: 'knee_problems', label: 'Knee Problems' },
  { value: 'shoulder_issues', label: 'Shoulder Issues' },
  { value: 'anxiety', label: 'Anxiety/Depression' },
  { value: 'pregnancy', label: 'Pregnancy' },
  { value: 'recent_surgery', label: 'Recent Surgery' },
  { value: 'other', label: 'Other (specify in notes)' }
];

const workoutTimes = [
  { value: 'early_morning', label: 'Early Morning (5-7 AM)' },
  { value: 'morning', label: 'Morning (7-10 AM)' },
  { value: 'late_morning', label: 'Late Morning (10 AM-12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12-3 PM)' },
  { value: 'late_afternoon', label: 'Late Afternoon (3-6 PM)' },
  { value: 'evening', label: 'Evening (6-9 PM)' },
  { value: 'weekends', label: 'Weekends Only' }
];

const leadSources = [
  'Website', 'Facebook Ad', 'Instagram', 'Google Ads', 'Referral', 'Gym Visit', 
  'Partner Business', 'Walk-in', 'Event/Workshop', 'Email Campaign', 'Other'
];

const budgetRanges = [
  'Under $50/week', '$50-100/week', '$100-150/week', '$150-200/week', 
  '$200-300/week', '$300+/week', 'Flexible/Discuss'
];

export default function LeadForm({ isOpen, onClose, onSave, initialData, mode }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    age: '',
    gender: '',
    fitness_goals: [],
    current_activity_level: '',
    previous_gym_experience: null,
    preferred_workout_types: [],
    health_conditions: [],
    dietary_restrictions: [],
    budget_range: '',
    preferred_contact_method: '',
    preferred_workout_times: [],
    lead_source: '',
    notes: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (formData.phone && !/^(\+61|0)[0-9\s\-\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Australian phone number';
        }
        if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 100)) {
          newErrors.age = 'Age must be between 13 and 100';
        }
        break;
      
      case 2: // Fitness Profile
        if (formData.fitness_goals.length === 0) {
          newErrors.fitness_goals = 'Please select at least one fitness goal';
        }
        if (!formData.current_activity_level) {
          newErrors.current_activity_level = 'Please select your current activity level';
        }
        break;

      case 3: // Preferences
        if (!formData.budget_range) {
          newErrors.budget_range = 'Please select a budget range';
        }
        if (!formData.preferred_contact_method) {
          newErrors.preferred_contact_method = 'Please select a preferred contact method';
        }
        break;

      case 4: // Additional Information
        if (!formData.lead_source) {
          newErrors.lead_source = 'Please specify how you heard about us';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSave(formData);
      onClose();
    }
  };

  const updateFormData = (field: keyof LeadFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayValue = (field: 'fitness_goals' | 'preferred_workout_types' | 'health_conditions' | 'preferred_workout_times', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-[#00e0ff] mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-600">Let&apos;s start with the basics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+61 400 123 456"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                  placeholder="Sydney, NSW"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.age ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="25"
                  min="13"
                  max="100"
                />
                {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 text-[#00e0ff] mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Fitness Profile</h3>
              <p className="text-sm text-gray-600">Tell us about your fitness goals and experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Fitness Goals *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {fitnessGoals.map(goal => (
                  <label key={goal.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.fitness_goals.includes(goal.value)}
                      onChange={() => toggleArrayValue('fitness_goals', goal.value)}
                      className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal.label}</span>
                  </label>
                ))}
              </div>
              {errors.fitness_goals && <p className="text-red-600 text-sm mt-1">{errors.fitness_goals}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Current Activity Level *</label>
              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: 'Sedentary - Little to no exercise' },
                  { value: 'lightly_active', label: 'Lightly Active - Light exercise 1-3 days/week' },
                  { value: 'moderately_active', label: 'Moderately Active - Moderate exercise 3-5 days/week' },
                  { value: 'very_active', label: 'Very Active - Hard exercise 6-7 days/week' },
                  { value: 'extremely_active', label: 'Extremely Active - Very hard exercise, training 2x/day' }
                ].map(level => (
                  <label key={level.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="activity_level"
                      value={level.value}
                      checked={formData.current_activity_level === level.value}
                      onChange={(e) => updateFormData('current_activity_level', e.target.value)}
                      className="border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
              {errors.current_activity_level && <p className="text-red-600 text-sm mt-1">{errors.current_activity_level}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Previous Gym Experience</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gym_experience"
                    checked={formData.previous_gym_experience === true}
                    onChange={() => updateFormData('previous_gym_experience', true)}
                    className="border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gym_experience"
                    checked={formData.previous_gym_experience === false}
                    onChange={() => updateFormData('previous_gym_experience', false)}
                    className="border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Workout Types</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workoutTypes.map(type => (
                  <label key={type.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferred_workout_types.includes(type.value)}
                      onChange={() => toggleArrayValue('preferred_workout_types', type.value)}
                      className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-[#00e0ff] mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Health & Preferences</h3>
              <p className="text-sm text-gray-600">Help us understand your specific needs</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Health Conditions or Injuries</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthConditions.map(condition => (
                  <label key={condition.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.health_conditions.includes(condition.value)}
                      onChange={() => toggleArrayValue('health_conditions', condition.value)}
                      className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{condition.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Workout Times</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workoutTimes.map(time => (
                  <label key={time.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferred_workout_times.includes(time.value)}
                      onChange={() => toggleArrayValue('preferred_workout_times', time.value)}
                      className="rounded border-gray-300 text-[#00e0ff] focus:ring-[#00e0ff]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{time.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => updateFormData('budget_range', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.budget_range ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                {errors.budget_range && <p className="text-red-600 text-sm mt-1">{errors.budget_range}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method *</label>
                <select
                  value={formData.preferred_contact_method}
                  onChange={(e) => updateFormData('preferred_contact_method', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                    errors.preferred_contact_method ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select contact method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="text">Text Message</option>
                </select>
                {errors.preferred_contact_method && <p className="text-red-600 text-sm mt-1">{errors.preferred_contact_method}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) => updateFormData('emergency_contact_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => updateFormData('emergency_contact_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                  placeholder="+61 400 123 456"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MessageSquare className="h-12 w-12 text-[#00e0ff] mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              <p className="text-sm text-gray-600">Almost done! Just a few more details</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? *</label>
              <select
                value={formData.lead_source}
                onChange={(e) => updateFormData('lead_source', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff] ${
                  errors.lead_source ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select source</option>
                {leadSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              {errors.lead_source && <p className="text-red-600 text-sm mt-1">{errors.lead_source}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
                placeholder="Any additional information, specific requests, or notes about this lead..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy & Consent</h4>
                  <p className="text-sm text-blue-700">
                    By submitting this form, the prospect consents to being contacted about fitness services. 
                    All health information will be kept confidential and used only for program design purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
            </h2>
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-[#00e0ff] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00e0ff] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep === totalSteps ? (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'add' ? 'Add Lead' : 'Save Changes'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}