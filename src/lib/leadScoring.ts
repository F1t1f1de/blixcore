// AI-Powered Lead Scoring Engine for Fitness Businesses
// Designed specifically for the Australian fitness market

export interface LeadScoringFactors {
  demographics: number;
  fitnessInterest: number;
  engagement: number;
  purchaseIntent: number;
  urgency: number;
  marketFactors: number;
}

export interface LeadScoringData {
  // Demographics
  age?: number;
  postcode?: string;
  location?: string;
  gender?: string;
  
  // Fitness Profile
  currentActivityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoals?: string[];
  previousGymExperience?: boolean;
  healthConditions?: string[];
  budgetRange?: string;
  
  // Engagement Data
  emailOpens?: number;
  emailClicks?: number;
  websiteVisits?: number;
  timeOnSite?: number; // minutes
  formCompletions?: number;
  
  // Behavioral Signals
  pricingPageViews?: number;
  demoRequests?: number;
  contactAttempts?: number;
  urgencyKeywords?: string[];
  
  // Business Context
  businessType?: 'personal_trainer' | 'gym' | 'physiotherapy' | 'yoga_studio' | 'nutrition';
  leadSource?: string;
  createdAt?: Date;
}

// Australian postcode intelligence for income/lifestyle scoring
const HIGH_VALUE_POSTCODES = [
  // Sydney premium areas
  '2000', '2007', '2008', '2010', '2011', '2021', '2023', '2024', '2025', '2027', '2028', '2029', '2030',
  '2031', '2061', '2062', '2063', '2064', '2065', '2066', '2067', '2068', '2069', '2070', '2071', '2072',
  '2073', '2074', '2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085',
  '2086', '2087', '2088', '2089', '2090', '2091', '2092', '2093', '2094', '2095', '2096', '2097', '2099',
  
  // Melbourne premium areas  
  '3000', '3001', '3002', '3003', '3004', '3005', '3006', '3008', '3121', '3122', '3123', '3124', '3125',
  '3126', '3127', '3128', '3129', '3141', '3142', '3143', '3144', '3161', '3162', '3163', '3181', '3182',
  '3183', '3184', '3185', '3186', '3187', '3188', '3189',
  
  // Brisbane premium areas
  '4000', '4001', '4005', '4006', '4007', '4059', '4064', '4065', '4066', '4067', '4068', '4069', '4070',
  
  // Perth premium areas
  '6000', '6001', '6004', '6005', '6006', '6007', '6008', '6009', '6010', '6011', '6012', '6014', '6015',
  
  // Adelaide premium areas
  '5000', '5001', '5006', '5007', '5008', '5034', '5035', '5037', '5061', '5062', '5063', '5064', '5065'
];

const MEDIUM_VALUE_POSTCODES = [
  // Outer suburban areas with good fitness potential
  '2100', '2101', '2102', '2103', '2104', '2105', '2106', '2107', '2108', '2109', '2110', '2111', '2112',
  '2113', '2114', '2115', '2116', '2117', '2118', '2119', '2120', '2121', '2122', '2130', '2131', '2132',
  // Add more medium value postcodes for each capital city
];

export function calculateLeadScore(data: LeadScoringData): { 
  totalScore: number; 
  breakdown: LeadScoringFactors;
  recommendations: string[];
  insights: string[];
} {
  const breakdown: LeadScoringFactors = {
    demographics: 0,
    fitnessInterest: 0,
    engagement: 0,
    purchaseIntent: 0,
    urgency: 0,
    marketFactors: 0
  };
  
  const recommendations: string[] = [];
  const insights: string[] = [];

  // DEMOGRAPHICS SCORING (25 points max)
  
  // Age scoring - fitness industry sweet spots
  if (data.age) {
    if (data.age >= 25 && data.age <= 45) {
      breakdown.demographics += 15; // Prime fitness age
      insights.push('🎯 Perfect age demographic for fitness commitment');
    } else if ((data.age >= 18 && data.age <= 24) || (data.age >= 46 && data.age <= 60)) {
      breakdown.demographics += 12; // Good fitness age
      if (data.age <= 24) insights.push('💪 Young adult - great for strength/muscle building programs');
      if (data.age >= 46) insights.push('🧘 Mature adult - ideal for wellness and mobility programs');
    } else if (data.age >= 61 && data.age <= 75) {
      breakdown.demographics += 8; // Senior fitness market
      insights.push('🏃‍♂️ Senior fitness - focus on health maintenance and mobility');
      recommendations.push('Recommend low-impact programs and health screenings');
    } else {
      breakdown.demographics += 5;
    }
  }

  // Location/Postcode intelligence
  if (data.postcode) {
    if (HIGH_VALUE_POSTCODES.includes(data.postcode)) {
      breakdown.demographics += 10;
      insights.push('💰 Premium location - high disposable income area');
      recommendations.push('Present premium packages and personal training options');
    } else if (MEDIUM_VALUE_POSTCODES.includes(data.postcode)) {
      breakdown.demographics += 7;
      insights.push('🏘️ Good suburban location - family-oriented fitness potential');
      recommendations.push('Focus on family packages and flexible scheduling');
    } else {
      breakdown.demographics += 4;
      insights.push('🌍 Standard location - price-sensitive approach recommended');
      recommendations.push('Emphasize value and community aspects');
    }
  }

  // FITNESS INTEREST SIGNALS (30 points max)
  
  // Activity level assessment
  if (data.currentActivityLevel) {
    switch (data.currentActivityLevel) {
      case 'sedentary':
        breakdown.fitnessInterest += 15; // Highest potential for improvement
        insights.push('🎯 Sedentary lifestyle - massive transformation potential');
        recommendations.push('Start with beginner-friendly programs and habit building');
        break;
      case 'lightly_active':
        breakdown.fitnessInterest += 12;
        insights.push('🚶‍♀️ Lightly active - ready to level up their fitness');
        recommendations.push('Progressive training programs with clear milestones');
        break;
      case 'moderately_active':
        breakdown.fitnessInterest += 10;
        insights.push('🏃‍♀️ Moderately active - seeking structured improvement');
        recommendations.push('Intermediate programs with specific goal focus');
        break;
      case 'very_active':
        breakdown.fitnessInterest += 8;
        insights.push('💪 Very active - wants optimization and performance');
        recommendations.push('Advanced training and performance tracking');
        break;
      case 'extremely_active':
        breakdown.fitnessInterest += 6;
        insights.push('🏆 Extremely active - potential training partner or ambassador');
        recommendations.push('Elite programs or consider as potential ambassador');
        break;
    }
  }

  // Previous gym experience
  if (data.previousGymExperience === true) {
    breakdown.fitnessInterest += 8;
    insights.push('🏋️‍♀️ Has gym experience - understands fitness value');
    recommendations.push('Highlight unique differentiators and community aspects');
  } else if (data.previousGymExperience === false) {
    breakdown.fitnessInterest += 12; // Higher score for new market potential
    insights.push('🌟 New to gym - huge growth potential');
    recommendations.push('Emphasize beginner support and non-intimidating environment');
  }

  // Fitness goals alignment
  if (data.fitnessGoals && data.fitnessGoals.length > 0) {
    breakdown.fitnessInterest += 7;
    const goalInsights = analyzeGoals(data.fitnessGoals);
    insights.push(goalInsights.insight);
    recommendations.push(goalInsights.recommendation);
  }

  // ENGAGEMENT SCORING (25 points max)
  
  // Email engagement
  if (data.emailOpens !== undefined && data.emailClicks !== undefined) {
    const emailEngagement = Math.min(data.emailOpens * 2 + data.emailClicks * 3, 10);
    breakdown.engagement += emailEngagement;
    
    if (emailEngagement >= 8) {
      insights.push('📧 Highly engaged with email content');
    } else if (emailEngagement >= 5) {
      insights.push('📬 Moderate email engagement');
      recommendations.push('Try more personalized email content');
    } else {
      insights.push('📭 Low email engagement');
      recommendations.push('Switch to phone or social media outreach');
    }
  }

  // Website engagement
  if (data.websiteVisits && data.timeOnSite) {
    const webEngagement = Math.min(data.websiteVisits * 2 + (data.timeOnSite / 60) * 3, 15);
    breakdown.engagement += webEngagement;
    
    if (data.timeOnSite > 5) {
      insights.push('🌐 Deep website exploration - serious interest');
    } else if (data.timeOnSite > 2) {
      insights.push('👀 Good website engagement');
    } else {
      insights.push('⚡ Quick website visits');
      recommendations.push('Improve landing page relevance and load speed');
    }
  }

  // PURCHASE INTENT (20 points max)
  
  // Pricing interest
  if (data.pricingPageViews && data.pricingPageViews > 0) {
    breakdown.purchaseIntent += Math.min(data.pricingPageViews * 3, 8);
    insights.push('💳 Actively researching pricing - high purchase intent');
    recommendations.push('Follow up with pricing discussion within 24 hours');
  }

  // Demo/trial requests
  if (data.demoRequests && data.demoRequests > 0) {
    breakdown.purchaseIntent += 8;
    insights.push('🎯 Requested demo - ready to experience the service');
    recommendations.push('Schedule demo immediately and prepare conversion close');
  }

  // Budget range analysis
  if (data.budgetRange) {
    const budgetScore = analyzeBudget(data.budgetRange, data.businessType);
    breakdown.purchaseIntent += budgetScore.score;
    insights.push(budgetScore.insight);
    recommendations.push(budgetScore.recommendation);
  }

  // URGENCY FACTORS (15 points max)
  
  // Urgency keywords in communications
  if (data.urgencyKeywords && data.urgencyKeywords.length > 0) {
    const urgencyScore = Math.min(data.urgencyKeywords.length * 3, 10);
    breakdown.urgency += urgencyScore;
    insights.push('⚡ Expressed urgency - wants to start soon');
    recommendations.push('Prioritize immediate contact and fast onboarding');
  }

  // Recency factor
  if (data.createdAt) {
    const daysOld = (Date.now() - data.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld <= 1) {
      breakdown.urgency += 5;
      insights.push('🕐 Fresh lead - strike while iron is hot');
      recommendations.push('Contact within 2 hours for maximum conversion');
    } else if (daysOld <= 7) {
      breakdown.urgency += 3;
      insights.push('📅 Recent lead - still warm');
    }
  }

  // MARKET FACTORS (15 points max)
  
  // Seasonal adjustments for Australian market
  const seasonalBoost = getSeasonalBoost();
  breakdown.marketFactors += seasonalBoost.score;
  if (seasonalBoost.insight) {
    insights.push(seasonalBoost.insight);
  }
  if (seasonalBoost.recommendation) {
    recommendations.push(seasonalBoost.recommendation);
  }

  // Lead source quality
  if (data.leadSource) {
    const sourceScore = analyzeLeadSource(data.leadSource);
    breakdown.marketFactors += sourceScore.score;
    insights.push(sourceScore.insight);
  }

  // Business type alignment
  if (data.businessType) {
    const businessAlignment = analyzeBusinessAlignment(data);
    breakdown.marketFactors += businessAlignment.score;
    insights.push(businessAlignment.insight);
    recommendations.push(businessAlignment.recommendation);
  }

  // Calculate total score
  const totalScore = Math.min(
    breakdown.demographics + 
    breakdown.fitnessInterest + 
    breakdown.engagement + 
    breakdown.purchaseIntent + 
    breakdown.urgency + 
    breakdown.marketFactors,
    100
  );

  // Add overall insights based on total score
  if (totalScore >= 85) {
    insights.unshift('🔥 HOT LEAD - Extremely high conversion potential');
    recommendations.unshift('URGENT: Contact immediately, prepare premium packages');
  } else if (totalScore >= 70) {
    insights.unshift('🎯 QUALIFIED LEAD - Strong conversion potential');
    recommendations.unshift('High priority: Contact within 4 hours');
  } else if (totalScore >= 50) {
    insights.unshift('⚡ WARM LEAD - Good potential with nurturing');
    recommendations.unshift('Follow up with educational content, then contact');
  } else if (totalScore >= 30) {
    insights.unshift('🌱 DEVELOPING LEAD - Needs nurturing');
    recommendations.unshift('Add to nurture campaign, focus on education');
  } else {
    insights.unshift('❄️ COLD LEAD - Low immediate potential');
    recommendations.unshift('Long-term nurture or consider disqualifying');
  }

  return {
    totalScore,
    breakdown,
    recommendations,
    insights
  };
}

function analyzeGoals(goals: string[]): { insight: string; recommendation: string } {
  const goalTypes = {
    weightLoss: ['weight_loss', 'lose_weight', 'fat_loss'],
    muscleGain: ['muscle_gain', 'build_muscle', 'strength', 'bodybuilding'],
    health: ['health', 'wellness', 'medical', 'rehabilitation'],
    performance: ['performance', 'athletic', 'sport', 'competition'],
    lifestyle: ['general_fitness', 'lifestyle', 'energy', 'confidence']
  };

  const hasWeightLoss = goals.some(goal => 
    goalTypes.weightLoss.some(type => goal.toLowerCase().includes(type))
  );
  const hasMuscleGain = goals.some(goal => 
    goalTypes.muscleGain.some(type => goal.toLowerCase().includes(type))
  );
  const hasHealth = goals.some(goal => 
    goalTypes.health.some(type => goal.toLowerCase().includes(type))
  );

  if (hasWeightLoss) {
    return {
      insight: '🎯 Weight loss goal - high motivation market',
      recommendation: 'Emphasize transformation success stories and nutrition support'
    };
  } else if (hasMuscleGain) {
    return {
      insight: '💪 Muscle building focus - committed to training',
      recommendation: 'Highlight strength programs and experienced trainers'
    };
  } else if (hasHealth) {
    return {
      insight: '🏥 Health-focused - values professional guidance',
      recommendation: 'Emphasize qualified trainers and health partnerships'
    };
  } else {
    return {
      insight: '🌟 Lifestyle improvement goals',
      recommendation: 'Focus on community and sustainable habit building'
    };
  }
}

function analyzeBudget(budgetRange: string, businessType?: string): { score: number; insight: string; recommendation: string } {
  const budget = budgetRange.toLowerCase();
  
  if (budget.includes('200+') || budget.includes('unlimited')) {
    return {
      score: 4,
      insight: '💎 Premium budget - no price sensitivity',
      recommendation: 'Present top-tier packages with premium services'
    };
  } else if (budget.includes('100-200') || budget.includes('150-250')) {
    return {
      score: 3,
      insight: '💰 Good budget - standard package target',
      recommendation: 'Focus on value and results, mid-tier packages'
    };
  } else if (budget.includes('50-100') || budget.includes('75-150')) {
    return {
      score: 2,
      insight: '💵 Moderate budget - price conscious',
      recommendation: 'Emphasize value, group classes, flexible payment plans'
    };
  } else {
    return {
      score: 1,
      insight: '🎱 Limited budget - needs convincing of value',
      recommendation: 'Start with trial offers and payment plans'
    };
  }
}

function getSeasonalBoost(): { score: number; insight?: string; recommendation?: string } {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  // New Year resolution period (Jan-Feb)
  if (month <= 2) {
    return {
      score: 5,
      insight: '🎊 New Year motivation - resolution season',
      recommendation: 'Emphasize fresh start and transformation packages'
    };
  }
  
  // Beach body season (Oct-Dec in Australia)
  if (month >= 10) {
    return {
      score: 4,
      insight: '🏖️ Summer body preparation time',
      recommendation: 'Focus on transformation and beach-ready programs'
    };
  }
  
  // Post-holiday (March)
  if (month === 3) {
    return {
      score: 3,
      insight: '🍽️ Post-holiday health focus',
      recommendation: 'Emphasize getting back on track after indulgences'
    };
  }
  
  return { score: 0 };
}

function analyzeLeadSource(source: string): { score: number; insight: string } {
  const lowerSource = source.toLowerCase();
  
  if (lowerSource.includes('referral') || lowerSource.includes('friend')) {
    return {
      score: 5,
      insight: '👥 Referral lead - highest quality source'
    };
  } else if (lowerSource.includes('website') || lowerSource.includes('organic')) {
    return {
      score: 4,
      insight: '🌐 Organic website - actively searching'
    };
  } else if (lowerSource.includes('social') || lowerSource.includes('facebook') || lowerSource.includes('instagram')) {
    return {
      score: 3,
      insight: '📱 Social media - engaged audience'
    };
  } else if (lowerSource.includes('google') || lowerSource.includes('search')) {
    return {
      score: 4,
      insight: '🔍 Search engine - high intent'
    };
  } else if (lowerSource.includes('ad') || lowerSource.includes('paid')) {
    return {
      score: 2,
      insight: '💰 Paid advertising - needs nurturing'
    };
  } else {
    return {
      score: 1,
      insight: '📋 Unknown source - track for optimization'
    };
  }
}

function analyzeBusinessAlignment(data: LeadScoringData): { score: number; insight: string; recommendation: string } {
  const businessType = data.businessType;
  const fitnessGoals = data.fitnessGoals || [];
  const activityLevel = data.currentActivityLevel;
  
  if (businessType === 'personal_trainer') {
    if (fitnessGoals.some(goal => goal.includes('weight_loss') || goal.includes('muscle_gain'))) {
      return {
        score: 4,
        insight: '🎯 Perfect PT client - specific transformation goals',
        recommendation: 'Emphasize 1-on-1 attention and customized programs'
      };
    }
  } else if (businessType === 'gym') {
    if (activityLevel === 'sedentary' || activityLevel === 'lightly_active') {
      return {
        score: 4,
        insight: '🏋️‍♀️ Great gym prospect - needs structured environment',
        recommendation: 'Highlight beginner programs and supportive community'
      };
    }
  } else if (businessType === 'yoga_studio') {
    if (fitnessGoals.some(goal => goal.includes('flexibility') || goal.includes('stress'))) {
      return {
        score: 4,
        insight: '🧘‍♀️ Ideal yoga client - seeking mindfulness and flexibility',
        recommendation: 'Focus on wellness benefits and community atmosphere'
      };
    }
  }
  
  return {
    score: 2,
    insight: '✅ General fitness alignment',
    recommendation: 'Standard approach with business strengths'
  };
}

// Export utility functions for components
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-red-600 bg-red-50 border-red-200'; // Hot
  if (score >= 70) return 'text-orange-600 bg-orange-50 border-orange-200'; // Qualified  
  if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'; // Warm
  if (score >= 30) return 'text-blue-600 bg-blue-50 border-blue-200'; // Developing
  return 'text-gray-600 bg-gray-50 border-gray-200'; // Cold
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'HOT';
  if (score >= 70) return 'QUALIFIED';
  if (score >= 50) return 'WARM';
  if (score >= 30) return 'DEVELOPING';
  return 'COLD';
}

export function getScoreIcon(score: number): string {
  if (score >= 85) return '🔥';
  if (score >= 70) return '🎯';
  if (score >= 50) return '⚡';
  if (score >= 30) return '🌱';
  return '❄️';
}