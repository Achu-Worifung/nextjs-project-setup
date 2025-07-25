import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import { AuthProvider } from "@/context/AuthContext";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";
import ChatWidget from "@/components/chat/chatwidget";



// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="w-full">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <GoogleMapsProvider>
              <Navbar />
              {children}
              <ChatWidget />
            </GoogleMapsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}