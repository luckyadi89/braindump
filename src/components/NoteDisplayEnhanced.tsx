'use client'

import { useState, useEffect } from 'react'
import { Download, Save, Share2, Heart, Folder, Tag, Copy, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { notesService, foldersService, tagsService, auth } from '@/lib/supabase-auth'

interface NoteDisplayEnhancedProps {
  transcript: string
  enhancedText: string
  style: string
  wordCount: number
  onEdit?: (text: string) => void
}

export function NoteDisplayEnhanced({ 
  transcript, 
  enhancedText, 
  style, 
  wordCount,
  onEdit 
}: NoteDisplayEnhancedProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(enhancedText)
  const [title, setTitle] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    loadFoldersAndTags()
    // Generate a default title from the first line
    const firstLine = enhancedText.split('\n')[0].slice(0, 50)
    setTitle(firstLine || 'Untitled Note')
  }, [enhancedText])

  const checkUser = async () => {
    const { user } = await auth.getUser()
    setUser(user)
  }

  const loadFoldersAndTags = async () => {
    try {
      const [foldersData, tagsData] = await Promise.all([
        foldersService.getAll(),
        tagsService.getAll()
      ])
      setFolders(foldersData || [])
      setTags(tagsData || [])
    } catch (error) {
      console.error('Error loading folders and tags:', error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save notes')
      return
    }

    setIsSaving(true)
    try {
      const noteData = {
        title: title || 'Untitled Note',
        original_transcript: transcript,
        enhanced_text: isEditing ? editedText : enhancedText,
        writing_style: style,
        word_count: wordCount,
        folder_id: selectedFolder || undefined
      }

      const savedNote = await notesService.create(noteData)
      setSavedNoteId(savedNote.id)
      
      alert('Note saved successfully!')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedText : enhancedText
    try {
      await navigator.clipboard.writeText(textToCopy)
      alert('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = () => {
    const textToDownload = isEditing ? editedText : enhancedText
    const blob = new Blob([textToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'note'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEditToggle = () => {
    if (isEditing && onEdit) {
      onEdit(editedText)
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Enhanced Text</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{wordCount} words</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {style}
          </span>
        </div>
      </div>

      {/* Title and Organization */}
      {user && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter note title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="text-sm text-gray-500">
                {tags.length === 0 ? 'No tags available' : 'Select tags (coming soon)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Content */}
      <div className="mb-6">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit your text here..."
          />
        ) : (
          <div className="prose max-w-none bg-gray-50 p-4 rounded-lg min-h-[200px]">
            <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
              {enhancedText}
            </pre>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleEditToggle} variant="secondary">
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? 'Finish Editing' : 'Edit Text'}
        </Button>

        <Button onClick={handleCopy} variant="secondary">
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>

        <Button onClick={handleDownload} variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        {user && (
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : savedNoteId ? 'Saved!' : 'Save Note'}
          </Button>
        )}

        {!user && (
          <div className="text-sm text-gray-500 flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            Sign in to save notes
          </div>
        )}
      </div>

      {/* Original Transcript (collapsible) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          View Original Transcript
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <pre className="whitespace-pre-wrap">{transcript}</pre>
        </div>
      </details>
    </div>
  )
}
