<<<<<<< HEAD
# BrainDump

AI voice-to-text app scaffolded by an assistant.

See project files for usage.
=======
# BrainDump - Voice to Text Application

Transform your thoughts into polished text instantly. BrainDump converts voice recordings into well-structured, professional text using AI.

## Features

- ��� **Voice Recording**: Record up to 3 minutes of audio
- ��� **AI Transcription**: Powered by OpenAI Whisper
- ✨ **Text Enhancement**: Multiple writing styles (journal, meeting notes, email, academic)
- ��� **Organization**: Folders and tags for note management
- ��� **Database Storage**: Supabase backend for sync across devices
- ��� **Responsive Design**: Works on desktop and mobile
- ��� **Real-time Processing**: Live feedback during transcription and enhancement

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI Services**: OpenAI (Whisper + GPT-4)
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd braindump
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and fill in your API keys:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the following SQL in the Supabase SQL editor:

```sql
-- Create tables
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6'
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  original_transcript TEXT NOT NULL,
  enhanced_text TEXT NOT NULL,
  audio_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  word_count INTEGER DEFAULT 0,
  processing_time INTEGER DEFAULT 0
);

CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Insert default folders
INSERT INTO folders (name, color) VALUES 
  ('Personal', '#10B981'),
  ('Work', '#3B82F6'),
  ('Projects', '#8B5CF6');

-- Insert default tags
INSERT INTO tags (name, color) VALUES 
  ('idea', '#F59E0B'),
  ('meeting', '#EF4444'),
  ('journal', '#10B981'),
  ('todo', '#8B5CF6');
```

### 4. Get API Keys

#### OpenAI API Key (Required)
1. Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information (pay-per-use)

#### Supabase Keys (Required)
1. In your Supabase project dashboard
2. Go to Settings > API
3. Copy your Project URL and anon/public key

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Record**: Click the orange microphone button to start recording
2. **Stop**: Click the square button to stop recording
3. **Process**: Choose a writing style and let AI enhance your text
4. **Edit**: Review and edit the enhanced text
5. **Organize**: Add to folders, add tags
6. **Save**: Save to your database for future access

## Writing Styles

- **Clear & Simple**: Clean, easy-to-read text
- **Personal Journal**: Reflective personal writing
- **Meeting Notes**: Professional meeting format with bullet points
- **Professional Email**: Business email structure
- **Academic Writing**: Scholarly and formal tone

## API Costs

- **OpenAI Whisper**: ~$0.006 per minute of audio
- **OpenAI GPT-4**: ~$0.03 per 1K tokens (text enhancement)
- **Supabase**: Free tier includes 50MB database, 500MB bandwidth

*Example: A 2-minute recording costs approximately $0.02-0.05 to process*

## Development

### Project Structure

```
src/
├── app/
│   ├── api/process-audio/    # Audio processing API route
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Main layout
│   └── page.tsx             # Home page
├── components/
│   ├── AudioRecorder.tsx    # Voice recording component
│   ├── NoteProcessor.tsx    # AI processing component
│   └── NoteDisplay.tsx      # Note display and editing
├── lib/
│   ├── openai.ts           # OpenAI integration
│   └── supabase.ts         # Supabase client and helpers
└── types/
    └── index.ts            # TypeScript type definitions
```

### Adding New Features

1. **New Writing Style**: Add to `defaultWritingStyles` in `src/lib/openai.ts`
2. **Database Schema**: Update Supabase tables and `src/lib/supabase.ts`
3. **UI Components**: Create new components in `src/components/`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

## Troubleshooting

### Common Issues

1. **Microphone Permission**: Ensure browser has microphone access
2. **API Errors**: Check API keys and billing status
3. **Database Errors**: Verify Supabase connection and table structure

### Browser Support

- Chrome 66+ (recommended)
- Firefox 55+
- Safari 14+
- Edge 79+

*Note: Requires modern browser with MediaRecorder API support*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the [troubleshooting guide](#troubleshooting)
2. Open an issue on GitHub
3. Contact support

---

**BrainDump** - Transform your thoughts into polished text ✨
>>>>>>> c57b849 (Initial commit: BrainDump AI voice-to-text application)
