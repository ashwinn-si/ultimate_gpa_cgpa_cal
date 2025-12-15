import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GPA Tracker | Calculate & Track Your CGPA",
    template: "%s | GPA Tracker"
  },
  description: "Free online GPA and CGPA calculator. Track your academic performance across semesters with beautiful visualizations, analytics, and grade management. Perfect for students managing their academic journey.",
  keywords: ['gpa calculator', 'cgpa calculator', 'grade tracker', 'academic performance', 'semester grades', 'gpa tracking', 'student grades', 'grade point average'],
  authors: [{ name: 'Ashwin Singh', url: 'https://www.ashwinsi.in' }],
  creator: 'Ashwin Singh',
  metadataBase: new URL('https://gpa-cgpa-cal-ultimate.ashwinsi.in'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gpa-cgpa-cal-ultimate.ashwinsi.in',
    title: 'GPA Tracker | Calculate & Track Your CGPA',
    description: 'Free online GPA and CGPA calculator with analytics and grade tracking.',
    siteName: 'GPA Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPA Tracker | Calculate & Track Your CGPA',
    description: 'Free online GPA and CGPA calculator with analytics and grade tracking.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
