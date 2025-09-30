// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  
  // Don't show Navbar/Footer on Home page (optional)
  // If you want them on Home too, remove this condition
  const hideLayout = location.pathname === '/';

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}