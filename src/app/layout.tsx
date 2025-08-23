<<<<<<< HEAD
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en"><body>{children}</body></html>); }
=======
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainDump - Voice to Text',
  description: 'Convert your voice recordings into well-structured, polished text instantly',
  keywords: 'voice to text, transcription, AI writing, note taking, speech to text',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Brain<span className="text-orange-500">Dump</span>
                </h1>
                <span className="ml-2 text-sm text-gray-500">
                  Voice to Text
                </span>
              </div>
              <nav className="flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Notes
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Settings
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Help
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-500 text-sm">
              <p>&copy; 2025 BrainDump. Transform your thoughts into polished text.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
>>>>>>> c57b849 (Initial commit: BrainDump AI voice-to-text application)
