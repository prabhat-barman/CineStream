// Placeholder / stub data for UI sections whose backend endpoints are not
// implemented yet. Tracked under "Known gaps" in docs/MOBILE_API.md:
//   - Notifications
//   - Public subscription plans
//   - Podcasts / Audio stories (no backend model)
//   - Recent searches (client-side history — could be persisted locally later)
//
// Everything else (movies, episodes, actors, profile) now comes from the real
// API in src/lib/api.ts. When the backend team ships the missing endpoints,
// delete the corresponding block below and wire in the real call.

import type {
  AudioStory,
  NotificationItem,
  Podcast,
  SubscriptionPlan,
} from '../types/movie';

export const recentSearches: string[] = [];

export const searchCategories: string[] = [
  'All Genres',
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Thriller',
];

export const podcasts: Podcast[] = [];

export const audioStories: AudioStory[] = [];

export const notifications: NotificationItem[] = [];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    price: '₹199',
    interval: 'month',
    perks: ['720p streaming', '1 device at a time', 'Ad-supported'],
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    price: '₹499',
    interval: 'month',
    perks: [
      '4K UHD + HDR streaming',
      'Watch on 4 devices',
      'Unlimited downloads',
      'Ad-free experience',
    ],
    highlighted: true,
  },
  {
    id: 'plan_annual',
    name: 'Annual',
    price: '₹4,999',
    interval: 'year',
    perks: [
      'All Premium benefits',
      'Save 20% vs monthly',
      'Priority customer support',
    ],
  },
];
