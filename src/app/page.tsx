'use client';

import { useState, useEffect } from 'react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { NoteProcessor } from '@/components/NoteProcessor';
import { NoteDisplay } from '@/components/NoteDisplay';
import { AuthForm } from '@/components/AuthForm';
import { UserDashboard } from '@/components/UserDashboard';
import { auth } from '@/lib/supabase-auth';
import { Mic, Brain, Sparkles, LogOut, Clock } from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'record' | 'process' | 'display'>('record');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [processedNote, setProcessedNote] = useState<{
    original: string;
    enhanced: string;
    wordCount: number;
    processingTime: number;
  } | null>(null);

  // Recording limits based on authentication
  const maxDuration = user ? 180 : 30; // 3 minutes for logged in, 30 seconds for guests
  const durationText = user ? '3 minutes' : '30 seconds';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user } = await auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    checkAuth();
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    setCurrentStep('record');
    setAudioBlob(null);
    setProcessedNote(null);
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setCurrentStep('process');
  };

  const handleProcessingComplete = (result: {
    original: string;
    enhanced: string;
    wordCount: number;
    processingTime: number;
  }) => {
    setProcessedNote(result);
    setCurrentStep('display');
  };

  const handleProcessingError = (error: string) => {
    console.error('Processing error:', error);
    alert(`Processing failed: ${error}`);
    setCurrentStep('record');
  };

  const handleStartOver = () => {
    setCurrentStep('record');
    setAudioBlob(null);
    setProcessedNote(null);
  };

  const handleSaveNote = (note: any) => {
    console.log('Saving note:', note);
    alert('Note saved successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome{user ? `, ${user.email?.split('@')[0]}` : ''}!
            </h1>
            {!user && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Guest Mode
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserDashboard />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Sign In to Unlock Full Features</h2>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <AuthForm
                mode={authMode}
                onModeChange={setAuthMode}
                onSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Voice into Polished Text
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Record your thoughts, ideas, and notes. Our AI will transcribe and enhance them into
            clear, well-structured text ready for sharing.
          </p>
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Guest Mode: {durationText} recording limit</span>
              </div>
              <p className="text-blue-600 text-sm">
                Sign in to unlock 3-minute recordings and save your notes to the cloud!
              </p>
            </div>
          )}
        </div>        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'record' ? 'text-orange-500' : currentStep === 'process' || currentStep === 'display' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'record' ? 'bg-orange-500 text-white' : currentStep === 'process' || currentStep === 'display' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                <Mic className="w-4 h-4" />
              </div>
              <span className="hidden sm:block font-medium">Record</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            <div className={`flex items-center space-x-2 ${currentStep === 'process' ? 'text-orange-500' : currentStep === 'display' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'process' ? 'bg-orange-500 text-white' : currentStep === 'display' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                <Brain className="w-4 h-4" />
              </div>
              <span className="hidden sm:block font-medium">Process</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            <div className={`flex items-center space-x-2 ${currentStep === 'display' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'display' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="hidden sm:block font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === 'record' && (
            <div>
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                maxDuration={maxDuration}
              />

              {/* Features List */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">High-Quality Recording</h3>
                  <p className="text-gray-600 text-sm">Record up to {durationText} of crystal clear audio with our advanced recording system.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Enhancement</h3>
                  <p className="text-gray-600 text-sm">Transform rambling thoughts into polished, professional text with multiple writing styles.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Get transcribed and enhanced text in seconds, ready to copy, edit, or share.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'process' && audioBlob && (
            <NoteProcessor
              audioBlob={audioBlob}
              onProcessingComplete={handleProcessingComplete}
              onProcessingError={handleProcessingError}
            />
          )}

          {currentStep === 'display' && processedNote && (
            <div>
              <NoteDisplay
                note={processedNote}
                onSave={handleSaveNote}
                onDelete={handleStartOver}
              />

              <div className="text-center mt-8">
                <button
                  onClick={handleStartOver}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Record Another Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
