import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { WishlistProvider } from '@/context/WishlistContext';
import RouteGuard from '@/components/RouteGuard/RouteGuard';

export const metadata = {
  title: 'VARAH — Premium Traditional Wear | Sarees, Lehengas & Ethnic Fashion',
  description: 'Discover India\'s finest handcrafted sarees, lehengas & traditional wear from master artisans. Shop authentic Banarasi silk, Kanjeevaram, designer lehengas & more at VARAH.',
  keywords: 'sarees, lehengas, traditional wear, ethnic fashion, Banarasi silk, Kanjeevaram, bridal lehenga, Indian fashion, handloom sarees',
  openGraph: {
    title: 'VARAH — Premium Traditional Wear',
    description: 'Handcrafted sarees, lehengas & traditional wear from master artisans across India.',
    siteName: 'VARAH',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <WishlistProvider>
            <CartProvider>
              <RouteGuard>
                {children}
              </RouteGuard>
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
