import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { promises as fs } from 'fs';
import ThemeToggle from './components/ThemeToggle';
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const file = await fs.readFile(process.cwd() + '/public/content/profileData.json', 'utf8');
    const cv = JSON.parse(file);
    return {
      title: cv.general.displayName,
      description: cv.general.byline || '',
    };
  } catch (error) {
    // Fallback metadata for routes that don't need profileData (like subdomains)
    return {
      title: 'Shubhaankar Sharma',
      description: 'Portfolio and writings',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' || savedTheme === 'light') {
                  document.documentElement.setAttribute('data-theme', savedTheme);
                } else {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const defaultTheme = prefersDark ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', defaultTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
