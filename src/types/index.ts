export interface Note {
  id: string;
  title: string;
  original_transcript: string;
  enhanced_text: string;
  audio_file_url?: string;
  created_at: string;
  updated_at: string;
  folder_id?: string;
  tags: string[];
  word_count: number;
  processing_time?: number;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface WritingStyle {
  id: string;
  name: string;
  prompt: string;
  is_default: boolean;
  description?: string;
}

export interface ProcessingOptions {
  style: string;
  language: string;
  customPrompt?: string;
}

export interface RecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob?: Blob;
  duration: number;
  error?: string;
}

export interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  maxDuration?: number;
}

export interface NoteProcessorProps {
  audioBlob: Blob;
  options: ProcessingOptions;
  onProcessingComplete: (note: Partial<Note>) => void;
  onProcessingError: (error: string) => void;
}
