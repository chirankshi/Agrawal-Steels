'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Products from '../components/Products';
import Manufacturing from '../components/Manufacturing';
import About from '../components/About';
import Journey from '../components/Journey';
import Certificates from '../components/Certificates';
import WhyUs from '../components/WhyUs';
import OrderProcess from '../components/OrderProcess';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollAnimations from '../components/ScrollAnimations';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState('');

  return (
    <>
      <ScrollAnimations />
      <Navbar />
      <main className="home-main">
        <Hero />
        <TrustStrip />
        <Products onSelectProduct={(prod) => setSelectedProduct(prod)} />
        <Manufacturing />
        <WhyUs />
        <Certificates />
        <About />
        <Journey />
        <OrderProcess />
        <ContactSection selectedProduct={selectedProduct} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
