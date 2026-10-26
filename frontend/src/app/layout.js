import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata = {
  title: 'Aggarwal Steels & Majestic AR Technology – Strong Foundations, Stronger Relations',
  description:
    'Aggarwal Steels & Majestic AR Technology – Primary Steel Distribution (SAIL, TATA, JSPL, AMNS), Heavy Warehouse Pallet Racking, Mezzanine Floors & 520ft Automated Powder Coating. ISO 9001:2015 Certified. Since 2015.',
  keywords: 'Aggarwal Steels, Majestic AR Technology, Aakash Goyal, TMT Bars, HR Plates, Warehouse Pallet Racks, Mezzanine Floors, Powder Coating Plant, Bhiwadi, Manesar',
  icons: {
    icon: '/images/brand/aggarwal_logo_circle.png',
    apple: '/images/brand/aggarwal_logo_circle.png',
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
      <body>{children}</body>
    </html>
  );
}
