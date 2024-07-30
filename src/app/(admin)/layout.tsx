import AdminSideBar from "@/components/custom/AdminSideBar";
import MobileNavBar from "@/components/custom/MobileNavBar";

interface RootLayoutProps {
  children: React.ReactNode;
}

// Opt out of caching for all data requests in the route segment
export const revalidate = 10 // revalidate at most every hour
export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <MobileNavBar />
      <div className="flex min-h-screen white">
        <AdminSideBar />


        {children}
      </div>
    </div>
  );
}
