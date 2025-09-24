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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-3">
              <img src="/blixcore-logo.png" alt="BlixCore" className="h-56 w-auto opacity-90 hover:opacity-100 transition-opacity mix-blend-multiply" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-[#00e0ff]">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-[#00e0ff]">Pricing</Link>
              <Link href="#industries" className="text-gray-600 hover:text-[#00e0ff]">Industries</Link>
              <Link href="/login" className="bg-[#00e0ff] text-[#001f3f] px-4 py-2 rounded-md hover:bg-[#00e0ff]/90 font-semibold">Login</Link>
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#00e0ff]/10 text-[#001f3f]">
                  🇦🇺 Built for Australian Fitness Businesses
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Generate More <span className="text-[#00e0ff] bg-gradient-to-r from-[#00e0ff] to-[#001f3f] bg-clip-text text-transparent">Fitness Clients</span> with AI-Powered Leads
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-light leading-relaxed">
                Blixcore helps personal trainers, gyms, and fitness studios in Australia capture, score, and convert more leads with industry-specific intelligence and automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="#contact" className="bg-gradient-to-r from-[#00e0ff] to-[#00e0ff]/80 text-[#001f3f] px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 text-center inline-block">
                  Start Free Trial
                </a>
                <a href="#features" className="border-2 border-[#00e0ff] text-[#00e0ff] px-10 py-4 rounded-xl text-xl font-bold hover:bg-[#00e0ff]/10 hover:scale-105 transition-all duration-300 text-center inline-block">
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
                <p className="text-gray-600 mb-6">Get started with lead generation for your fitness business</p>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#00e0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="location"
                        placeholder="Business Location (e.g., Sydney, Melbourne)"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e0ff] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#00e0ff] text-[#001f3f] py-3 px-4 rounded-lg font-semibold hover:bg-[#00e0ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Built Specifically for <span className="text-[#00e0ff]">Fitness</span> Businesses
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Unlike generic CRM tools, Blixcore understands the fitness industry and helps you convert prospects into loyal clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00e0ff]/20 to-[#001f3f]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                <Target className="w-10 h-10 text-[#00e0ff]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Lead Scoring</h3>
              <p className="text-lg text-gray-600 leading-relaxed">AI-powered scoring considers fitness goals, activity level, and engagement to prioritize your hottest prospects.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#00e0ff]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness-First Forms</h3>
              <p className="text-gray-600">Capture detailed fitness profiles including goals, experience level, and health conditions for better client matching.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#00e0ff]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Analytics</h3>
              <p className="text-gray-600">Track seasonal trends, client acquisition costs, and fitness-specific conversion rates to grow your business.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#00e0ff]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness App Integrations</h3>
              <p className="text-gray-600">Connect with MyFitnessPal, Strava, and other fitness platforms to enrich lead profiles automatically.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#00e0ff]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Templates</h3>
              <p className="text-gray-600">Pre-built email sequences for New Year fitness goals, summer prep, and other seasonal fitness campaigns.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00e0ff]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#00e0ff]" />
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
              <div className="w-12 h-12 bg-[#00e0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-6 h-6 text-[#00e0ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Trainers</h3>
              <p className="text-sm text-gray-600">Build your client base with targeted lead capture and automated follow-up sequences.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#00e0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-[#00e0ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gyms & Studios</h3>
              <p className="text-sm text-gray-600">Increase membership conversions with smart lead scoring and campaign management.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#00e0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#00e0ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Physiotherapy</h3>
              <p className="text-sm text-gray-600">Capture health-conscious leads and manage referrals with specialized intake forms.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#00e0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#00e0ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wellness Coaches</h3>
              <p className="text-sm text-gray-600">Connect with clients seeking holistic health solutions and nutrition guidance.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-6">
                <img src="/blixcore-logo.png" alt="BlixCore" className="h-80 w-auto opacity-90 mix-blend-multiply" />
              </div>
              <p className="text-gray-400 mb-4">The lead generation platform built specifically for Australian fitness businesses.</p>
              <p className="text-sm text-gray-500">🇦🇺 Proudly Australian-owned</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="#features" className="block hover:text-white">Features</Link>
                <Link href="#industries" className="block hover:text-white">Industries</Link>
                <span className="block text-gray-500">More Coming Soon</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <span className="block text-gray-500">Coming Soon</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <span className="block text-gray-500">Coming Soon</span>
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
