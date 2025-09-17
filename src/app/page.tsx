'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Users, TrendingUp, Zap, Shield, Target } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business_name: '',
    business_type: '',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fitness_goals: ['business_growth'],
          current_activity_level: 'very_active',
          lead_source: 'website_homepage'
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', business_name: '', business_type: '', phone: '', location: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-600">Blixcore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-emerald-600">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-emerald-600">Pricing</Link>
              <Link href="#industries" className="text-gray-600 hover:text-emerald-600">Industries</Link>
              <Link href="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  🇦🇺 Built for Australian Fitness Businesses
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Generate More <span className="text-emerald-600">Fitness Clients</span> with AI-Powered Leads
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Blixcore helps personal trainers, gyms, and fitness studios in Australia capture, score, and convert more leads with industry-specific intelligence and automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="#contact" className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 text-center">
                  Start Free Trial
                </a>
                <a href="#features" className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-50 text-center">
                  See How It Works
                </a>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            
            {/* Lead Capture Form */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
                <p className="text-gray-600 mb-6">Join 500+ fitness businesses growing with Blixcore</p>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Blixcore!</h4>
                    <p className="text-gray-600">We&apos;ll send you setup instructions within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Business Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="business_name"
                        placeholder="Fitness Business Name"
                        value={formData.business_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select Business Type</option>
                        <option value="personal_trainer">Personal Trainer</option>
                        <option value="gym">Gym/Fitness Center</option>
                        <option value="physiotherapy">Physiotherapy Clinic</option>
                        <option value="yoga_studio">Yoga Studio</option>
                        <option value="nutrition">Nutrition/Wellness</option>
                        <option value="other">Other Fitness Business</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="location"
                        placeholder="Business Location (e.g., Sydney, Melbourne)"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Setting Up Your Account...' : 'Start Free 14-Day Trial'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built Specifically for Fitness Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike generic CRM tools, Blixcore understands the fitness industry and helps you convert prospects into loyal clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Lead Scoring</h3>
              <p className="text-gray-600">AI-powered scoring considers fitness goals, activity level, and engagement to prioritize your hottest prospects.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness-First Forms</h3>
              <p className="text-gray-600">Capture detailed fitness profiles including goals, experience level, and health conditions for better client matching.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Analytics</h3>
              <p className="text-gray-600">Track seasonal trends, client acquisition costs, and fitness-specific conversion rates to grow your business.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness App Integrations</h3>
              <p className="text-gray-600">Connect with MyFitnessPal, Strava, and other fitness platforms to enrich lead profiles automatically.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Templates</h3>
              <p className="text-gray-600">Pre-built email sequences for New Year fitness goals, summer prep, and other seasonal fitness campaigns.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Australian Compliance</h3>
              <p className="text-gray-600">Built with Australian privacy laws and fitness industry regulations in mind, including health data protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Type of Fitness Business
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Trainers</h3>
              <p className="text-sm text-gray-600">Build your client base with targeted lead capture and automated follow-up sequences.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gyms & Studios</h3>
              <p className="text-sm text-gray-600">Increase membership conversions with smart lead scoring and campaign management.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Physiotherapy</h3>
              <p className="text-sm text-gray-600">Capture health-conscious leads and manage referrals with specialized intake forms.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wellness Coaches</h3>
              <p className="text-sm text-gray-600">Connect with clients seeking holistic health solutions and nutrition guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Trusted by Australian Fitness Professionals
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div>
                <div className="text-4xl font-bold mb-2">87%</div>
                <div>Increase in Lead Quality</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3.2x</div>
                <div>More Conversions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div>Active Fitness Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-bold">Blixcore</h3>
              </div>
              <p className="text-gray-400 mb-4">The lead generation platform built specifically for Australian fitness businesses.</p>
              <p className="text-sm text-gray-500">🇦🇺 Proudly Australian-owned</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="#features" className="block hover:text-white">Features</Link>
                <Link href="#industries" className="block hover:text-white">Industries</Link>
                <Link href="/integrations" className="block hover:text-white">Integrations</Link>
                <Link href="/pricing" className="block hover:text-white">Pricing</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="/blog" className="block hover:text-white">Fitness Marketing Blog</Link>
                <Link href="/case-studies" className="block hover:text-white">Success Stories</Link>
                <Link href="/help" className="block hover:text-white">Help Center</Link>
                <Link href="/api-docs" className="block hover:text-white">API Documentation</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/contact" className="block hover:text-white">Contact</Link>
                <Link href="/privacy" className="block hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Blixcore. All rights reserved. Built for the Australian fitness industry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
