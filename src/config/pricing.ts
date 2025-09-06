// Regional Pricing Configuration
export const pricingPlans = {
  // Indian Market (Price-sensitive)
  IN: {
    currency: 'INR',
    plans: {
      free: {
        name: 'Free',
        price: 0,
        credits: 10,
        features: ['Basic transcription', '5 min audio limit']
      },
      basic: {
        name: 'Basic',
        price: 299, // ₹299/month - More accessible
        credits: 100,
        features: ['AI enhancement', '30 min audio limit', 'Export options']
      },
      pro: {
        name: 'Pro', 
        price: 499, // ₹499/month - Your original price
        credits: 500,
        features: ['Unlimited audio', 'Folders & tags', 'Priority support']
      },
      business: {
        name: 'Business',
        price: 999, // ₹999/month - For teams
        credits: 2000,
        features: ['Team collaboration', 'API access', 'Custom integrations']
      }
    }
  },

  // US/International Market (Higher willingness to pay)
  US: {
    currency: 'USD',
    plans: {
      free: {
        name: 'Free',
        price: 0,
        credits: 10,
        features: ['Basic transcription', '5 min audio limit']
      },
      basic: {
        name: 'Basic',
        price: 9.99, // $9.99/month ≈ ₹830
        credits: 100,
        features: ['AI enhancement', '30 min audio limit', 'Export options']
      },
      pro: {
        name: 'Pro',
        price: 19.99, // $19.99/month ≈ ₹1,650
        credits: 500,
        features: ['Unlimited audio', 'Folders & tags', 'Priority support']
      },
      business: {
        name: 'Business',
        price: 49.99, // $49.99/month ≈ ₹4,150
        credits: 2000,
        features: ['Team collaboration', 'API access', 'Custom integrations']
      }
    }
  },

  // European Market
  EU: {
    currency: 'EUR',
    plans: {
      free: {
        name: 'Free',
        price: 0,
        credits: 10,
        features: ['Basic transcription', '5 min audio limit']
      },
      basic: {
        name: 'Basic',
        price: 8.99, // €8.99/month
        credits: 100,
        features: ['AI enhancement', '30 min audio limit', 'Export options']
      },
      pro: {
        name: 'Pro',
        price: 17.99, // €17.99/month
        credits: 500,
        features: ['Unlimited audio', 'Folders & tags', 'Priority support']
      },
      business: {
        name: 'Business',
        price: 44.99, // €44.99/month
        credits: 2000,
        features: ['Team collaboration', 'API access', 'Custom integrations']
      }
    }
  }
};

// Geo-detection function
export const detectUserRegion = async (ip?: string): Promise<keyof typeof pricingPlans> => {
  try {
    // Use IP geolocation service
    const response = await fetch(`https://ipapi.co/${ip || ''}/json/`);
    const data = await response.json();
    
    const countryCode = data.country_code;
    
    // Map countries to pricing regions
    if (countryCode === 'IN') return 'IN';
    if (['US', 'CA'].includes(countryCode)) return 'US';
    if (['DE', 'FR', 'IT', 'ES', 'NL', 'GB'].includes(countryCode)) return 'EU';
    
    // Default to US pricing for other countries
    return 'US';
  } catch (error) {
    // Fallback to US pricing
    return 'US';
  }
};

// Get pricing for user's region
export const getUserPricing = async (userIP?: string) => {
  const region = await detectUserRegion(userIP);
  return {
    region,
    plans: pricingPlans[region],
    currency: pricingPlans[region].currency
  };
};
