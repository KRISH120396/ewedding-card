import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Krishnanshu & Shriya's Wedding",
  description: "You are warmly invited to celebrate the wedding of Dr. Krishnanshu & Dr. Shriya.",
  openGraph: {
    title: "Krishnanshu & Shriya's Wedding",
    description: "Join us in celebrating our new beginning! ✨",
    url: 'https://shriya-krishnanshu-wedding.vercel.app', // You will create this link in Step 3!
    siteName: 'Krishnanshu & Shriya',
    images: [
      {
        url: '/avatars/welcome.jpeg', // This forces WhatsApp to use your welcome image!
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
