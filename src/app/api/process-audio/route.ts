import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio, enhanceText } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const style = formData.get('style') as string || 'clear';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Step 1: Transcribe audio
    console.log('Starting transcription...');
    const transcript = await transcribeAudio(audioFile);
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      );
    }

    // Step 2: Enhance text
    console.log('Enhancing text...');
    const enhanced = await enhanceText(transcript, style);

    return NextResponse.json({
      transcript,
      enhanced,
      style,
      wordCount: enhanced.split(' ').length
    });

  } catch (error) {
    console.error('Audio processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
