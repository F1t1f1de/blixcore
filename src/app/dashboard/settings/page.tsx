'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and application preferences
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Fitness Business"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="user@fitnessbusiness.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                defaultValue="Australia"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00e0ff]/20 focus:border-[#00e0ff]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">AI Scoring Enabled</h3>
                <p className="text-sm text-gray-500">Automatically score new leads using AI</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-[#00e0ff] focus:ring-[#00e0ff] border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Get notified about hot leads</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-[#00e0ff] focus:ring-[#00e0ff] border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#00e0ff] rounded-lg hover:bg-[#00e0ff]/90">
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}