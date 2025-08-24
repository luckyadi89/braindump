import OpenAI from 'openai';

// This should only be used server-side
const getOpenAIClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI client should not be used on the client-side');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    
    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function enhanceText(
  transcript: string,
  style: string = 'clear',
  customPrompt?: string
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const stylePrompts: Record<string, string> = {
      clear: "Convert this spoken transcript into clear, well-structured text. Remove filler words, fix grammar, and organize into proper paragraphs while maintaining the original meaning and tone.",
      journal: "Transform this transcript into a personal journal entry. Make it reflective and well-structured, maintaining the personal tone while improving clarity and flow.",
      meeting: "Convert this into professional meeting notes. Organize into bullet points, highlight key decisions and action items, and maintain a business-appropriate tone.",
      email: "Transform this transcript into a professional email format. Include appropriate greeting and closing, organize the content logically, and maintain a business tone.",
      academic: "Convert this into academic prose. Use formal language, proper structure, and scholarly tone while maintaining the original ideas and arguments.",
      creative: "Transform this transcript into creative, engaging prose. Enhance the narrative flow, use vivid language, and make it compelling to read.",
      bullet: "Convert this transcript into clear bullet points. Organize the information hierarchically and make it easy to scan and understand."
    };

    const systemPrompt = customPrompt || stylePrompts[style] || stylePrompts.clear;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user', 
          content: `Please process this transcript:\n\n"${transcript}"`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || transcript;
  } catch (error) {
    console.error('Text enhancement error:', error);
    throw new Error('Failed to enhance text');
  }
}

export const defaultWritingStyles = [
  {
    id: 'clear',
    name: 'Clear & Simple',
    description: 'Clean, easy-to-read text',
    prompt: 'Convert this spoken transcript into clear, well-structured text. Remove filler words, fix grammar, and organize into proper paragraphs while maintaining the original meaning and tone.'
  },
  {
    id: 'journal',
    name: 'Personal Journal',
    description: 'Reflective personal writing',
    prompt: 'Transform this transcript into a personal journal entry. Make it reflective and well-structured, maintaining the personal tone while improving clarity and flow.'
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Professional meeting format',
    prompt: 'Convert this into professional meeting notes. Organize into bullet points, highlight key decisions and action items, and maintain a business-appropriate tone.'
  },
  {
    id: 'email',
    name: 'Professional Email',
    description: 'Business email format',
    prompt: 'Transform this transcript into a professional email format. Include appropriate structure, organize the content logically, and maintain a business tone.'
  },
  {
    id: 'academic',
    name: 'Academic Writing',
    description: 'Scholarly and formal',
    prompt: 'Convert this into academic prose. Use formal language, proper structure, and scholarly tone while maintaining the original ideas and arguments.'
  }
];
