import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import AppToaster from "@/components/ui/app-toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "UniLost | AI-Powered Campus Lost & Found",
  description: "Reuniting students with their lost items through CLIP-AI matching and real-time coordination. Secure, fast, and mobile-first.",
  keywords: ["university", "lost and found", "AI matching", "campus security", "student tools"],
  authors: [{ name: "UniLost Team" }],
  openGraph: {
    title: "UniLost - Smart Campus Recovery",
    description: "The next generation of campus lost and found.",
    type: "website",
    url: "https://unilost.edu",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniLost",
    description: "AI-Powered Campus Recovery",
  }
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 selection:bg-primary/20`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <FloatingNavbar />
              <main className="flex-1 pt-28 pb-12 px-6">
                {children}
              </main>
              <AppToaster />
              {/* Background Decorative Elements */}
              <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full delay-700 animate-pulse" />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


