import { NextRequest, NextResponse } from 'next/server';

// Mock fitness lead data store for MVP demo
const mockLeads: {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  age?: number;
  gender?: string;
  fitness_goals: string[];
  current_activity_level: string;
  previous_gym_experience?: boolean;
  budget_range?: string;
  status: string;
  score: number;
  created_at: string;
  updated_at: string;
  business_name?: string | null;
  business_type?: string | null;
  location?: string | null;
}[] = [
  {
    id: '1',
    full_name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+61400123456',
    age: 32,
    gender: 'female',
    fitness_goals: ['weight_loss', 'general_fitness'],
    current_activity_level: 'lightly_active',
    previous_gym_experience: false,
    budget_range: '$100-200/week',
    status: 'new',
    score: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    full_name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+61400654321',
    age: 28,
    gender: 'male',
    fitness_goals: ['muscle_gain', 'strength'],
    current_activity_level: 'moderately_active',
    previous_gym_experience: true,
    budget_range: '$200+/week',
    status: 'contacted',
    score: 72,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      name, 
      email, 
      business_name, 
      business_type, 
      phone, 
      location,
      fitness_goals,
      current_activity_level,
      lead_source 
    } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create new lead with fitness data
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      full_name: name,
      email: email,
      phone: phone || null,
      location: location || null,
      fitness_goals: fitness_goals || ['business_growth'],
      current_activity_level: current_activity_level || 'moderately_active',
      lead_source: lead_source || 'website',
      status: 'new',
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      business_name: business_name || null,
      business_type: business_type || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data for demo
    mockLeads.unshift(newLead);

    return NextResponse.json(
      { message: 'Lead created successfully', id: newLead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return mock fitness leads for demo
    return NextResponse.json(mockLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}