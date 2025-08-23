'use client';

import { useState } from 'react';
import { 
  Copy, 
  Share2, 
  Download, 
  Edit3, 
  Trash2, 
  Folder, 
  Tag, 
  Clock,
  FileText,
  Mic
} from 'lucide-react';
import { Note } from '@/types';

interface NoteDisplayProps {
  note: {
    original: string;
    enhanced: string;
    wordCount: number;
    processingTime: number;
  };
  onSave?: (note: Note) => void;
  onDelete?: () => void;
}

export function NoteDisplay({ note, onSave, onDelete }: NoteDisplayProps) {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.enhanced);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(note.enhanced);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([note.enhanced], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'braindump-note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveNote = () => {
    if (onSave) {
      const noteData: Note = {
        id: '',
        title: title || `Note ${new Date().toLocaleDateString()}`,
        original_transcript: note.original,
        enhanced_text: editedText,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        word_count: editedText.split(' ').length,
        tags,
        folder_id: selectedFolder || undefined,
        processing_time: note.processingTime
      };
      onSave(noteData);
    }
  };

  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Title and Actions */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none focus:border-b-2 focus:border-orange-500 flex-1 mr-4"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className={`p-2 rounded-full transition-colors ${
                showOriginal ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              title="Toggle original transcript"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-full transition-colors ${
                isEditing ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title="Edit note"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={downloadAsText}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title="Download as text file"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{note.wordCount} words</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Processed in {formatDuration(note.processingTime)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Created {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Organization Options */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Organize</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Folder className="w-4 h-4 inline mr-1" />
              Folder
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">No folder</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="projects">Projects</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <input
              type="text"
              placeholder="Add tags (comma-separated)"
              onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Original Transcript (if shown) */}
      {showOriginal && (
        <div className="bg-gray-50 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Mic className="w-5 h-5 mr-2" />
            Original Transcript
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {note.original}
          </p>
        </div>
      )}

      {/* Enhanced Note */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Enhanced Note
        </h3>
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Edit your note..."
          />
        ) : (
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {editedText}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
        
        <div className="space-x-3">
          <button
            onClick={() => {/* Share functionality */}}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={saveNote}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
