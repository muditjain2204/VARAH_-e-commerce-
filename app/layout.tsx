import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "MAA LAXMI — Premium Indian Sarees Online",
    template: "%s | MAA LAXMI",
  },
  description:
    "Shop premium handcrafted Indian sarees — Banarasi, Silk, Cotton, Kanjivaram, Chiffon, Net & more. Authentic sarees with free shipping across India.",
  keywords: [
    "saree",
    "sarees online",
    "Indian saree",
    "Banarasi saree",
    "Silk saree",
    "Cotton saree",
    "Kanjivaram saree",
    "wedding saree",
    "buy saree online India",
  ],
  authors: [{ name: "MAA LAXMI" }],
  creator: "MAA LAXMI",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MAA LAXMI",
    title: "MAA LAXMI — Premium Indian Sarees Online",
    description:
      "Shop premium handcrafted Indian sarees. Banarasi, Silk, Cotton, Kanjivaram & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAA LAXMI — Premium Indian Sarees Online",
    description:
      "Shop premium handcrafted Indian sarees. Banarasi, Silk, Cotton, Kanjivaram & more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Sign in to MAA LAXMI",
            subtitle: "Welcome back! Please sign in to continue",
          },
        },
        signUp: {
          start: {
            title: "Create your MAA LAXMI account",
            subtitle: "Welcome! Please fill in your details to get started",
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: "#8b1a1a",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "shadow-2xl border border-stone-200/80 rounded-2xl",
          formButtonPrimary: "bg-[#8b1a1a] hover:bg-[#721515] text-white font-semibold transition-all shadow-sm",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
