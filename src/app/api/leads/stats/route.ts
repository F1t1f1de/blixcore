import { NextResponse } from 'next/server';

// Mock fitness stats for demo
export async function GET() {
  try {
    const mockStats = {
      total: 156,
      new: 23,
      contacted: 45,
      qualified: 67,
      converted: 18,
      lost: 3,
      averageScore: 74,
      highScoreLeads: 89,
      conversionRate: 12,
      topFitnessGoals: [
        { goal: 'weight_loss', count: 78 },
        { goal: 'general_fitness', count: 45 },
        { goal: 'muscle_gain', count: 34 }
      ],
      activityLevels: {
        sedentary: 45,
        lightly_active: 67,
        moderately_active: 32,
        very_active: 12,
        unknown: 0
      }
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}