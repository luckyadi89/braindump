'use client'

import { useState, useEffect } from 'react'
import { Mic, Settings, User, LogOut } from 'lucide-react'
import { AudioRecorder } from '@/components/AudioRecorder'
import { NoteProcessor } from '@/components/NoteProcessor'
import { NoteDisplayEnhanced } from '@/components/NoteDisplayEnhanced'
import { AuthForm } from '@/components/AuthForm'
import { UserDashboard } from '@/components/UserDashboard'
import { auth } from '@/lib/supabase-auth'

export default function HomePage() {
  const [step, setStep] = useState<'record' | 'process' | 'review'>('record')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [result, setResult] = useState<{
    transcript: string
    enhanced: string
    style: string
    wordCount: number
  } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user } = await auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob)
    setStep('process')
  }

  const handleProcessingComplete = (processedResult: any) => {
    setResult(processedResult)
    setStep('review')
  }

  const handleNewRecording = () => {
    setStep('record')
    setAudioBlob(null)
    setResult(null)
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
    checkUser()
  }

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mic className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">BrainDump</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Dashboard */}
        {user && (
          <div className="mb-8">
            <UserDashboard />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'record' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'record' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Record</span>
            </div>
            
            <div className={`w-12 h-px ${step !== 'record' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${step === 'process' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'process' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Process</span>
            </div>
            
            <div className={`w-12 h-px ${step === 'review' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'review' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>

          {/* Step Content */}
          {step === 'record' && (
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          )}

          {step === 'process' && audioBlob && (
            <NoteProcessor 
              audioBlob={audioBlob} 
              onProcessingComplete={handleProcessingComplete}
              onProcessingError={(error) => console.error('Processing error:', error)}
            />
          )}

          {step === 'review' && result && (
            <div className="space-y-6">
              <NoteDisplayEnhanced 
                transcript={result.transcript}
                enhancedText={result.enhanced}
                style={result.style}
                wordCount={result.wordCount}
              />
              
              <div className="text-center">
                <button
                  onClick={handleNewRecording}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Record Another Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AuthForm
                mode={authMode}
                onModeChange={setAuthMode}
                onSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
