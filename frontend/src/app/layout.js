import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import SiteMotion from '../components/SiteMotion';
import BootSkeleton from '../components/BootSkeleton';
import BootSkeletonHider from '../components/BootSkeletonHider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aggarwalsteel.com'),
  title: {
    default: 'Aggarwal Steels & Majestic AR Technology – Strong Foundations, Stronger Relations',
    template: '%s | Aggarwal Steels',
  },
  description:
    'Aggarwal Steels & Majestic AR Technology – Primary Steel Distribution (SAIL, TATA, JSPL, AMNS), Heavy Warehouse Pallet Racking, Mezzanine Floors & 520ft Automated Powder Coating. ISO 9001:2015 Certified. Since 2015.',
  keywords: 'Aggarwal Steels, Majestic AR Technology, Aakash Goyal, TMT Bars, HR Plates, Warehouse Pallet Racks, Mezzanine Floors, Powder Coating Plant, Bhiwadi, Manesar',
  openGraph: {
    type: 'website',
    siteName: 'Aggarwal Steels & Majestic AR Technology',
    images: ['/images/catalogue/racking.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/images/brand/aggarwal_logo_circle.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('as_theme');
                  var pref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  var theme = saved || pref || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body><noscript><style>{`.boot-splash{display:none!important}html *{animation-play-state:running!important}`}</style></noscript><BootSkeleton />{children}<SiteMotion /><BootSkeletonHider /></body>
    </html>
  );
}
