'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wand2, FileText } from 'lucide-react';
import { ProcessingOptions } from '@/types';
import { defaultWritingStyles } from '@/lib/openai';

interface NoteProcessorProps {
  audioBlob: Blob;
  onProcessingComplete: (result: {
    original: string;
    enhanced: string;
    wordCount: number;
    processingTime: number;
  }) => void;
  onProcessingError: (error: string) => void;
}

export function NoteProcessor({ 
  audioBlob, 
  onProcessingComplete, 
  onProcessingError 
}: NoteProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'transcribing' | 'enhancing' | 'complete'>('transcribing');
  const [selectedStyle, setSelectedStyle] = useState('clear');

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setCurrentStep('transcribing');
    const startTime = Date.now();

    try {
      // Create FormData for audio upload
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('style', selectedStyle);

      // Call API route for processing
      const response = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const result = await response.json();
      const processingTime = Date.now() - startTime;

      setCurrentStep('complete');
      
      onProcessingComplete({
        original: result.transcript,
        enhanced: result.enhanced,
        wordCount: result.enhanced.split(' ').length,
        processingTime
      });

    } catch (error) {
      console.error('Processing error:', error);
      onProcessingError(error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processAudio();
  }, [audioBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-lg border">
      {/* Style Selection */}
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Writing Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          disabled={isProcessing}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          {defaultWritingStyles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {defaultWritingStyles.find(s => s.id === selectedStyle)?.description}
        </p>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          
          <div className="text-center">
            {currentStep === 'transcribing' && (
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Transcribing audio...</span>
              </div>
            )}
            {currentStep === 'enhancing' && (
              <div className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Enhancing text...</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center max-w-sm">
            This usually takes 10-30 seconds depending on the recording length
          </div>
        </div>
      )}

      {/* Processing Steps */}
      <div className="flex items-center space-x-4 w-full max-w-md">
        <div className={`flex items-center space-x-2 ${
          currentStep === 'transcribing' ? 'text-blue-500' : 
          currentStep === 'enhancing' || currentStep === 'complete' ? 'text-green-500' : 'text-gray-400'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            currentStep === 'transcribing' ? 'bg-blue-500 animate-pulse' : 
            currentStep === 'enhancing' || currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm">Transcribe</span>
        </div>

        <div className="flex-1 h-px bg-gray-300"></div>

        <div className={`flex items-center space-x-2 ${
          currentStep === 'enhancing' ? 'text-purple-500' : 
          currentStep === 'complete' ? 'text-green-500' : 'text-gray-400'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            currentStep === 'enhancing' ? 'bg-purple-500 animate-pulse' : 
            currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm">Enhance</span>
        </div>

        <div className="flex-1 h-px bg-gray-300"></div>

        <div className={`flex items-center space-x-2 ${
          currentStep === 'complete' ? 'text-green-500' : 'text-gray-400'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm">Complete</span>
        </div>
      </div>
    </div>
  );
}
