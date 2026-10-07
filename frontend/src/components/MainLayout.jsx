import React from 'react';
import Navbar from './Navbar.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream dark:bg-ink transition-colors duration-300">
      <Navbar />

      <main>
        {children}
      </main>
    </div>
  );
}