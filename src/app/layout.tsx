import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SuperFlow | Voice-Driven Neuro-Symbolic Metasystem Architect',
  description:
    'A voice-driven systems architecture studio that transforms conversational human design captured via Wispr Flow into formally verified, supercompiled topologies using Valentin Turchin Refal-5 cybernetics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="h-full bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
