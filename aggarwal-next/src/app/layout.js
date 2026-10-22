import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata = {
  title: 'Aggarwal Steels – Strong Foundations, Stronger Relations',
  description:
    "Aggarwal Steels – India's trusted supplier of TMT Bars, HR Plates, MS Angles, Channels, Beams, CR Coils, GP Coils & more. PAN India delivery. Est. 1990.",
  keywords: 'Aggarwal Steels, TMT Bars, MS Angles, HR Plates, Steel Supplier India, Faridabad Steel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
