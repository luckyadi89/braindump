'use client'

import { useState } from 'react'
import { auth } from '@/lib/supabase-auth'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
  onSuccess: () => void
}

export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signup') {
        result = await auth.signUp(email, password, fullName)
      } else {
        result = await auth.signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              required
            />
          )}
          
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
