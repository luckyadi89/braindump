interface EnvironmentConfig {
  isDevelopment: boolean
  isBeta: boolean
  isProduction: boolean
  appUrl: string
  apiUrl: string
  supabaseUrl: string
  supabaseAnonKey: string
  stripePublishableKey: string
  environment: 'development' | 'beta' | 'production'
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'development'
  
  const baseConfig = {
    isDevelopment: appEnv === 'development',
    isBeta: appEnv === 'beta',
    isProduction: appEnv === 'production',
    environment: appEnv as 'development' | 'beta' | 'production',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  }

  // Environment-specific validations
  if (baseConfig.isProduction) {
    if (!baseConfig.supabaseUrl || baseConfig.supabaseUrl.includes('localhost')) {
      throw new Error('Production environment requires valid Supabase URL')
    }
    if (baseConfig.stripePublishableKey?.startsWith('pk_test_')) {
      throw new Error('Production environment cannot use Stripe test keys')
    }
  }

  return baseConfig
}

export const config = getEnvironmentConfig()

// Feature flags per environment
export const features = {
  enableAnalytics: config.isProduction,
  enableDebugMode: config.isDevelopment,
  enableBetaFeatures: config.isBeta || config.isDevelopment,
  enableErrorTracking: config.isProduction || config.isBeta,
  enablePayments: config.isProduction || config.isBeta,
  maxCreditsPerDay: config.isDevelopment ? 1000 : config.isBeta ? 100 : 50,
}

// Logging configuration
export const logging = {
  level: config.isDevelopment ? 'debug' : config.isBeta ? 'info' : 'warn',
  enableConsole: !config.isProduction,
  enableRemote: config.isProduction || config.isBeta,
}
