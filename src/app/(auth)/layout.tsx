import Footer from '@/components/custom/Footer';
import Header from '@/components/custom/Header';
import MobileNavBar from '@/components/custom/MobileNavBar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <MobileNavBar />
      {children}
      <Footer />
      
    </div>
  );
}
