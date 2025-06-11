

import { Molengo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import Navbar from '@/components/ui/Navbar';
import { Metadata } from 'next';


const monteCarloFont = Molengo({
  weight: "400",
  variable: "--font-monlengo",
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: "PriestBook",
  description: "Application for booking priest for personal occassion"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <body className={`${monteCarloFont.className} antialiased pattern`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            {/* <Footer /> */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}