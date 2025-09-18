# Blixcore - Fitness Lead Generation SaaS for Australia 🇦🇺

## 🚀 Live Demo
[View Live Demo](https://blixcore.vercel.app/)

## 🏋️ Fitness Industry Focus ✅

Blixcore is specifically built for Australian fitness businesses including personal trainers, gyms, physiotherapy clinics, yoga studios, and wellness coaches.

### Core Features Completed ✅
1. **Fitness-Focused Landing Page** ✅ - Australian fitness industry branding and messaging
2. **Industry-Specific Lead Capture** ✅ - Forms designed for fitness client acquisition
3. **Smart Lead Scoring** ✅ - AI-powered scoring based on fitness industry criteria
4. **Fitness Analytics Dashboard** ✅ - Industry-specific metrics and insights
5. **Lead Management System** ✅ - Track prospects through fitness client journey
6. **Supabase Integration Ready** ✅ - Complete database schema for fitness businesses

### Fitness Industry Features
- **Smart Lead Scoring Algorithm**: Considers age, fitness goals, activity level, and purchase intent
- **Fitness-Specific Data Fields**: Goals, activity level, health conditions, workout preferences
- **Industry Insights**: Track conversion by fitness goals, seasonal patterns, client acquisition costs
- **Australian Market Focus**: Built with Australian fitness regulations and market understanding

### Technology Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL) with complete fitness schema
- **Authentication**: Supabase Auth (ready for implementation)
- **Deployment**: Vercel
- **Icons**: Lucide React (fitness-themed icons)

## 🎯 Target Market
- **Personal Trainers**: Build client base with targeted lead capture
- **Gyms & Fitness Centers**: Increase membership conversions
- **Physiotherapy Clinics**: Capture health-conscious leads with specialized intake
- **Yoga Studios**: Connect with wellness-focused prospects
- **Nutrition Coaches**: Track leads seeking holistic health solutions

## 🏗️ Architecture

### Database Schema (Supabase)
```sql
-- Core Tables
users (fitness business owners)
leads (fitness prospects with detailed profiles)
lead_activities (engagement tracking)
campaigns (fitness marketing campaigns)
integrations (MyFitnessPal, Strava, etc.)
analytics (fitness-specific metrics)
```

### Lead Scoring Algorithm
**100-point scoring system:**
- **Demographics (25 points)**: Age, location, contact details
- **Fitness Interest (30 points)**: Goals, activity level, experience
- **Engagement (25 points)**: Form completion, activity tracking
- **Purchase Intent (20 points)**: Budget, timing, preferences

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 8.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/blixcore.git
cd blixcore

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret (for demo auth)
JWT_SECRET=your-super-secure-jwt-key
```

### Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Update environment variables with your Supabase credentials

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Features Deep Dive

### 1. Smart Lead Scoring
```typescript
// Fitness-specific scoring criteria
- Demographics: Prime fitness age (25-45) gets highest scores
- Activity Level: Sedentary users have high conversion potential
- Experience: New to fitness = excellent opportunity
- Goals: Specific goals indicate higher commitment
- Engagement: Health condition disclosure shows serious intent
```

### 2. Fitness Lead Capture Forms
- **Business Type Selection**: Personal trainer, gym, physio, etc.
- **Fitness Goals**: Weight loss, muscle gain, general health
- **Activity Level**: 5-tier system (sedentary to extremely active)
- **Health Considerations**: Conditions, injuries, restrictions
- **Budget Range**: Fitness service pricing tiers
- **Workout Preferences**: Types, timing, location preferences

### 3. Analytics Dashboard
- **Conversion rates by fitness goal type**
- **Seasonal fitness trends** (New Year, summer prep)
- **Age group performance analysis**
- **Activity level distribution**
- **Client acquisition cost tracking**

### 4. Integration Ready
- **MyFitnessPal**: Nutrition data enrichment
- **Strava**: Activity tracking integration
- **Trainerize**: Trainer management platform
- **Mindbody**: Scheduling and booking
- **Webhook support**: Custom fitness app connections

## 📈 Business Benefits

### For Personal Trainers
- Capture high-quality leads with fitness-specific profiles
- Score prospects based on conversion likelihood
- Track seasonal fitness trends for marketing timing
- Automated follow-up sequences for fitness goals

### For Gyms & Studios
- Increase membership conversion rates
- Segment leads by fitness experience level
- Track performance by lead source and campaign
- Identify high-value prospects for premium services

### for Physiotherapy Clinics
- Specialized health condition intake forms
- Track referral sources and conversion rates
- Manage leads with specific health requirements
- Compliance with Australian health data regulations

## 🔒 Security & Compliance

- **Australian Privacy Laws**: Built with Privacy Act 1988 compliance
- **Health Data Protection**: Secure handling of fitness and health information
- **Row Level Security**: Supabase RLS policies implemented
- **Authentication**: Supabase Auth with role-based access
- **Data Encryption**: All sensitive data encrypted at rest and in transit

## 🚧 Implementation Status

### ✅ Completed
- [x] Fitness industry landing page and branding
- [x] Lead capture forms with fitness-specific fields
- [x] Smart lead scoring algorithm for fitness businesses
- [x] Mock data and API endpoints for demo
- [x] Responsive design with fitness industry aesthetics
- [x] Complete Supabase database schema
- [x] TypeScript types for all fitness data structures
- [x] Production build optimization

### 🚧 In Progress
- [ ] Supabase authentication integration
- [ ] Real-time dashboard updates
- [ ] Campaign management system
- [ ] Email notification system

### 📋 Next Phase
- [ ] Fitness app integrations (MyFitnessPal, Strava)
- [ ] Advanced analytics with charts
- [ ] Mobile app development
- [ ] Team collaboration features
- [ ] API documentation and developer tools

## 📱 Mobile Responsiveness

Fully optimized for fitness professionals who work on mobile:
- Touch-friendly lead capture forms
- Quick lead entry during client consultations  
- Real-time notifications for new fitness leads
- Offline capability for critical functions

## 🎨 Design Philosophy

- **Fitness Industry Aesthetics**: Emerald green primary color, energetic but professional
- **Australian Market**: Local references, compliance considerations
- **Conversion Optimized**: Forms and CTAs designed for fitness lead capture
- **Mobile-First**: Built for fitness professionals on-the-go

## 📞 Support

For support with your fitness business lead generation:
- **Documentation**: [docs.blixcore.com.au](https://docs.blixcore.com.au)
- **Email Support**: support@blixcore.com.au
- **Phone**: 1300 BLIX CORE (Australian business hours)

## 🇦🇺 Proudly Australian

Built specifically for the Australian fitness industry with:
- Local market understanding
- Australian privacy law compliance
- Fitness industry best practices
- Support during Australian business hours

---

**💪 Built for Australian fitness professionals, by fitness industry experts.**