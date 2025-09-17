import { Database } from '@/types/database'

type Lead = Database['public']['Tables']['leads']['Row']

interface LeadScoringFactors {
  demographics: number;
  fitnessInterest: number;
  engagement: number;
  purchaseIntent: number;
}

/**
 * Calculate lead score for fitness businesses (0-100 points)
 * 
 * Scoring Criteria:
 * - Demographics (25 points): Age, location, gender
 * - Fitness Interest (30 points): Goals, activity level, experience
 * - Engagement (25 points): Form completion, activity tracking
 * - Purchase Intent (20 points): Budget, urgency, contact preferences
 */
export function calculateLeadScore(lead: Lead, activities: number = 0): number {
  let score = 0;
  const factors: LeadScoringFactors = {
    demographics: 0,
    fitnessInterest: 0,
    engagement: 0,
    purchaseIntent: 0
  };

  // Demographics (25 points max)
  if (lead.age) {
    // Prime fitness age range 25-45 gets higher scores
    if (lead.age >= 25 && lead.age <= 45) {
      factors.demographics += 15;
    } else if (lead.age >= 18 && lead.age <= 55) {
      factors.demographics += 10;
    } else {
      factors.demographics += 5;
    }
  }

  if (lead.location) {
    factors.demographics += 5; // Location provided shows local intent
  }

  if (lead.phone) {
    factors.demographics += 5; // Phone number shows higher commitment
  }

  // Fitness Interest Signals (30 points max)
  if (lead.previous_gym_experience === true) {
    factors.fitnessInterest += 10; // Previous gym experience is valuable
  } else if (lead.previous_gym_experience === false) {
    factors.fitnessInterest += 15; // New to fitness = high potential
  }

  if (lead.current_activity_level) {
    switch (lead.current_activity_level) {
      case 'sedentary':
        factors.fitnessInterest += 15; // High potential for improvement
        break;
      case 'lightly_active':
        factors.fitnessInterest += 12;
        break;
      case 'moderately_active':
        factors.fitnessInterest += 8;
        break;
      case 'very_active':
        factors.fitnessInterest += 5;
        break;
      case 'extremely_active':
        factors.fitnessInterest += 3; // May already have solutions
        break;
    }
  }

  if (lead.fitness_goals && lead.fitness_goals.length > 0) {
    factors.fitnessInterest += 5; // Has specific fitness goals
  }

  // Engagement Level (25 points max)
  // Base engagement for completing the form
  factors.engagement += 10;

  // Additional points for more detailed information
  if (lead.preferred_workout_types && lead.preferred_workout_types.length > 0) {
    factors.engagement += 5;
  }

  if (lead.health_conditions && lead.health_conditions.length > 0) {
    factors.engagement += 5; // Health awareness shows serious intent
  }

  // Activity-based engagement scoring
  if (activities > 10) {
    factors.engagement += 5;
  } else if (activities > 5) {
    factors.engagement += 3;
  } else if (activities > 0) {
    factors.engagement += 2;
  }

  // Purchase Intent (20 points max)
  if (lead.budget_range) {
    // Higher budget ranges indicate stronger purchase intent
    if (lead.budget_range.includes('200+') || lead.budget_range.includes('premium')) {
      factors.purchaseIntent += 10;
    } else if (lead.budget_range.includes('100-200')) {
      factors.purchaseIntent += 8;
    } else if (lead.budget_range.includes('50-100')) {
      factors.purchaseIntent += 6;
    } else {
      factors.purchaseIntent += 4;
    }
  }

  if (lead.preferred_contact_method) {
    factors.purchaseIntent += 5; // Contact preference shows readiness
  }

  if (lead.preferred_workout_times && lead.preferred_workout_times.length > 0) {
    factors.purchaseIntent += 5; // Specific timing shows commitment
  }

  // Calculate total score
  score = factors.demographics + factors.fitnessInterest + factors.engagement + factors.purchaseIntent;

  // Ensure score doesn't exceed 100
  return Math.min(score, 100);
}

/**
 * Get lead score breakdown for explanation
 */
export function getLeadScoreBreakdown(lead: Lead, activities: number = 0): {
  total: number;
  factors: LeadScoringFactors;
  insights: string[];
} {
  const factors: LeadScoringFactors = {
    demographics: 0,
    fitnessInterest: 0,
    engagement: 0,
    purchaseIntent: 0
  };

  const insights: string[] = [];

  // Recalculate with detailed tracking
  // Demographics
  if (lead.age && lead.age >= 25 && lead.age <= 45) {
    factors.demographics += 15;
    insights.push('Prime fitness age demographic');
  }

  // Fitness Interest
  if (lead.current_activity_level === 'sedentary') {
    factors.fitnessInterest += 15;
    insights.push('High potential - currently sedentary');
  }

  if (lead.previous_gym_experience === false) {
    factors.fitnessInterest += 15;
    insights.push('New to fitness - excellent conversion potential');
  }

  // Engagement
  if (lead.health_conditions && lead.health_conditions.length > 0) {
    factors.engagement += 5;
    insights.push('Health-conscious - provided medical information');
  }

  // Purchase Intent
  if (lead.budget_range?.includes('200+')) {
    factors.purchaseIntent += 10;
    insights.push('Premium budget range - high value prospect');
  }

  const total = calculateLeadScore(lead, activities);

  return { total, factors, insights };
}

/**
 * Get lead priority level based on score
 */
export function getLeadPriority(score: number): 'low' | 'medium' | 'high' | 'hot' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Get fitness-specific lead insights
 */
export function getFitnessLeadInsights(lead: Lead): string[] {
  const insights: string[] = [];

  if (lead.fitness_goals?.includes('weight_loss')) {
    insights.push('🎯 Weight loss goal - high motivation potential');
  }

  if (lead.fitness_goals?.includes('muscle_gain')) {
    insights.push('💪 Muscle gain goal - likely long-term client');
  }

  if (lead.current_activity_level === 'sedentary') {
    insights.push('📈 Sedentary lifestyle - huge transformation opportunity');
  }

  if (lead.previous_gym_experience === false) {
    insights.push('🆕 New to fitness - needs guidance and support');
  }

  if (lead.age && lead.age > 40) {
    insights.push('👤 40+ demographic - often serious about health changes');
  }

  if (lead.health_conditions && lead.health_conditions.length > 0) {
    insights.push('🏥 Health considerations - may need specialized approach');
  }

  return insights;
}