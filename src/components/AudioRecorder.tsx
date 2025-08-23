'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { AudioRecorderProps, RecordingState } from '@/types';

export function AudioRecorder({ 
  onRecordingComplete, 
  onRecordingStart, 
  onRecordingStop,
  maxDuration = 180 // 3 minutes default
}: AudioRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isProcessing: false,
    duration: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordingState(prev => ({ ...prev, audioBlob }));
        onRecordingComplete(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState(prev => ({ ...prev, isRecording: true, duration: 0 }));
      onRecordingStart?.();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return { ...prev, duration: newDuration };
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState(prev => ({ 
        ...prev, 
        error: 'Failed to access microphone. Please check permissions.' 
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      setRecordingState(prev => ({ ...prev, isRecording: false }));
      onRecordingStop?.();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordingState.audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordingState.audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMaxDurationFormatted = () => {
    return formatDuration(maxDuration);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg border">
      {/* Main Recording Button */}
      <button
        onClick={recordingState.isRecording ? stopRecording : startRecording}
        disabled={recordingState.isProcessing}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-200
          ${recordingState.isRecording 
            ? 'bg-red-500 hover:bg-red-600 recording-pulse' 
            : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
          }
          ${recordingState.isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {recordingState.isRecording ? (
          <Square className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>

      {/* Status Text */}
      <div className="text-center">
        {recordingState.isRecording && (
          <div className="text-red-600 font-medium">
            Recording... {formatDuration(recordingState.duration)}
          </div>
        )}
        {!recordingState.isRecording && !recordingState.audioBlob && (
          <div className="text-gray-600">
            Click to start recording (max {getMaxDurationFormatted()})
          </div>
        )}
        {recordingState.audioBlob && !recordingState.isRecording && (
          <div className="text-green-600 font-medium">
            Recording complete ({formatDuration(recordingState.duration)})
          </div>
        )}
      </div>

      {/* Playback Controls */}
      {recordingState.audioBlob && (
        <div className="flex items-center space-x-3">
          <button
            onClick={isPlaying ? pausePlayback : playRecording}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <span className="text-sm text-gray-600">
            Preview recording
          </span>
        </div>
      )}

      {/* Error Message */}
      {recordingState.error && (
        <div className="text-red-600 text-sm text-center max-w-md">
          {recordingState.error}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
