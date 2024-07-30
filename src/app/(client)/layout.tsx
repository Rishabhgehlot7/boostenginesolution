import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import MobileNavBar from "@/components/custom/MobileNavBar";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

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
      <Toaster />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </div>
  );
}
