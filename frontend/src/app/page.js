'use client';
import { useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TickerStrip from '../components/TickerStrip';
import Products from '../components/Products';
import Manufacturing from '../components/Manufacturing';
import PartnersStrip from '../components/PartnersStrip';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import Journey from '../components/Journey';
import Presence from '../components/Presence';
import OrderProcess from '../components/OrderProcess';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState('');

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <TickerStrip />
        <Products onSelectProduct={(prod) => setSelectedProduct(prod)} />
        <Manufacturing />
        <PartnersStrip />
        <About />
        <WhyUs />
        <Journey />
        <Presence />
        <OrderProcess />
        <ContactSection selectedProduct={selectedProduct} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
