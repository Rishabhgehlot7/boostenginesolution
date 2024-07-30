import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const inter = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothinix",
  description: "Discover the latest fashion trends at Clothinix. Shop our wide selection of clothing for men, women, and kids. Enjoy great prices and fast shipping.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <StoreProvider>
          <Head>
            {/* <link rel="shortcut icon" href={favicon} /> */}
            <title>Clothinix - Fashion for Every Occasion</title>
            <meta
              name="title"
              content="Clothinix - Fashion for Every Occasion"
            />
            <meta
              name="description"
              content="Discover the latest fashion trends at Clothinix. Shop our wide selection of clothing for men, women, and kids. Enjoy great prices and fast shipping."
            />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://clothinix.com/" />
            <meta
              property="og:title"
              content="Clothinix - Fashion for Every Occasion"
            />
            <meta
              property="og:description"
              content="Discover the latest fashion trends at Clothinix. Shop our wide selection of clothing for men, women, and kids. Enjoy great prices and fast shipping."
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://clothinix.com/" />
            <meta
              property="twitter:title"
              content="Clothinix - Fashion for Every Occasion"
            />
            <meta
              property="twitter:description"
              content="Discover the latest fashion trends at Clothinix. Shop our wide selection of clothing for men, women, and kids. Enjoy great prices and fast shipping."
            />

            {/* Additional Meta Tags */}
            <meta
              name="keywords"
              content="Clothinix, fashion, clothing, men, women, kids, trendy, affordable fashion, online shopping"
            />
            <meta name="author" content="Clothinix" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta charSet="UTF-8" />
            <link rel="shortcut icon" href="./favicon.ico" />
          </Head>
          <body className={inter.className}>
            <div className="black">{children}</div>
            <Toaster />
          </body>
        </StoreProvider>
      </AuthProvider>
    </html>
  );
}
