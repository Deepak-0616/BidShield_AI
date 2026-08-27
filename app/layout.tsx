import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'BidShield AI — Procurement Compliance & Risk Intelligence Platform',
  description: 'AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F7FA] text-[#17202A] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

