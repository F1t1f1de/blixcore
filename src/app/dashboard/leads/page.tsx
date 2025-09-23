'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import DashboardLayout from '@/components/DashboardLayout';
import LeadManagement from '@/components/LeadManagement';

export default function LeadsPage() {
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
      <LeadManagement />
    </DashboardLayout>
  );
}