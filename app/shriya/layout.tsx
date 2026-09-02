export const metadata = {
  title: "Shriya & Krishnanshu's Wedding",
  description: "Kindly join us for our celebration of togetherness.",
  openGraph: {
    title: "Shriya & Krishnanshu's Wedding",
    description: "Join us in celebrating our new beginning! ✨",
    url: 'https://ewedding-card-zeta.vercel.app/shriya', 
    siteName: 'Shriya & Krishnanshu',
    images: [
      {
        url: '/avatars/shriya-welcome.jpeg', 
        width: 800,
        height: 600,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function BrideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}