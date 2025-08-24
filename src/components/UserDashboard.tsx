'use client'

import { useState, useEffect } from 'react'
import { auth, subscriptionService } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/Button'

interface UserProfile {
  subscription_tier: string
  subscription_status: string
  credits_remaining: number
}

export function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { user } = await auth.getUser()
      setUser(user)
      
      if (user) {
        const profileData = await subscriptionService.getCurrentSubscription()
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || user.email}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">Subscription</h3>
            <p className="text-blue-700 capitalize">{profile.subscription_tier}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              profile.subscription_status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.subscription_status}
            </span>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-900">Credits Remaining</h3>
            <p className="text-green-700 text-2xl font-bold">{profile.credits_remaining}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-900">Quick Action</h3>
            <Button size="sm" className="mt-2">
              Upgrade Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
