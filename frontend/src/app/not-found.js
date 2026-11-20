import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="not-found-page">
        <div className="section-container not-found-inner">
          <span className="segment-rule wide" aria-hidden="true" />
          <p className="not-found-code">404</p>
          <h1>This page could not be found</h1>
          <p>The link may be old, or the page may have moved. These are the places most people are looking for:</p>
          <div className="not-found-links">
            <Link href="/products" className="btn-primary">Browse products</Link>
            <Link href="/contact" className="btn-secondary">Get a quote</Link>
            <Link href="/" className="btn-secondary">Home page</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
