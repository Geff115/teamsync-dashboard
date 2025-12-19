import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeamSync - Smart Meeting Tracker',
  description: 'AI-powered meeting action item tracker built with Motia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <Link href="/" className="flex items-center space-x-2">
                    <CheckCircle2 className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-slate-900">
                      TeamSync
                    </span>
                  </Link>
                  <div className="flex space-x-8">
                    <Link
                      href="/"
                      className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/actions"
                      className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      Actions
                    </Link>
                    <Link
                      href="/upload"
                      className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      Upload
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-sm text-slate-600">
                  Built with ❤️ using Motia • Powered by AI
                </p>
              </div>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}