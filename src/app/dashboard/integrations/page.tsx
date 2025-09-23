'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import DashboardLayout from '@/components/DashboardLayout';

export default function IntegrationsPage() {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Fitness App Integrations</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">MyFitnessPal, Strava & other integrations coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}