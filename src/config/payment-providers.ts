// Updated Payment Strategy for Indian Market
export const paymentProviders = {
  // Primary for Indian customers
  razorpay: {
    regions: ['IN'],
    supported_methods: [
      'upi',
      'cards', // All Indian cards
      'netbanking',
      'wallets', // Paytm, PhonePe, etc.
      'emi',
      'paylater'
    ],
    currency: 'INR',
    fees: '2% + GST', // Much lower than Stripe
    setup_required: 'Indian business registration + KYC'
  },

  // For international customers (if we can get access)
  stripe_international: {
    regions: ['US', 'EU', 'UK', 'AU', 'CA'],
    supported_methods: ['cards', 'apple_pay', 'google_pay'],
    currencies: ['USD', 'EUR', 'GBP'],
    fees: '2.9% + $0.30',
    setup_required: 'Invite-only + international entity'
  },

  // Alternative for international
  paypal: {
    regions: ['US', 'EU', 'UK', 'AU', 'CA'],
    supported_methods: ['paypal', 'cards'],
    currencies: ['USD', 'EUR', 'GBP'],
    fees: '3.49% + fixed fee',
    setup_required: 'Business verification'
  },

  // Backup international option
  paddle: {
    regions: ['Global'],
    supported_methods: ['cards', 'paypal', 'apple_pay'],
    currencies: ['USD', 'EUR', 'GBP'],
    fees: '5% + $0.50', // Higher but easier setup
    setup_required: 'Standard business verification'
  }
};

// Smart payment routing
export const getPaymentProvider = (userRegion: string, preferredMethod?: string) => {
  if (userRegion === 'IN') {
    return 'razorpay'; // Always use Razorpay for Indian users
  }
  
  // For international users, try in order of preference
  return 'stripe_international'; // If available
  // Fallback to PayPal or Paddle
};
