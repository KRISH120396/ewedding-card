export const metadata = {
  title: "डॉ. क्रिश्नांशू आणि डॉ. श्रिया यांचा विवाह सोहळा",
  description: "आमच्या आनंदात सहभागी होण्याचे अगत्याचे निमंत्रण.",
  openGraph: {
    title: "डॉ. क्रिश्नांशू आणि डॉ. श्रिया यांचा विवाह सोहळा",
    description: "आमच्या नव्या प्रवासाची सुरुवात! ✨",
    url: 'https://ewedding-card-zeta.vercel.app/marathi', 
    siteName: 'क्रिश्नांशू आणि श्रिया',
    images: [{ url: '/avatars/welcome.jpeg', width: 800, height: 600 }],
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function MarathiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}