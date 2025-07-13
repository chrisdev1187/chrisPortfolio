"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import ChatWidget from './ChatWidget';

library.add(faBars, faXmark);

const validPages = [
  '/',
  '/services',
  '/portfolio',
  '/about',
  '/admin/login'
];

const NavItem = ({ link, index, navLinksCount, pathname, closeMenu, isMobile }) => {
  const [hash, setHash] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  // Determine if this nav item is active
  let isActive = false;
  if (link.href === '/#contact') {
    isActive = hash === '#contact' || pathname === '/#contact';
  } else {
    isActive = pathname === link.href;
  }

  // Only enable effects on valid pages
  const enableEffects = validPages.includes(pathname);

  // Gradient style
  const gradientStyle = {
    background: 'linear-gradient(to right, #007bff, #e83e8c)',
    backgroundSize: '400% 100%',
    backgroundPosition: `${(index / (navLinksCount - 1)) * 100}% 50%`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  };

  // Class logic
  let className = `font-bold transition-colors ${isMobile ? 'block text-center py-2' : ''}`;
  if ((isActive || isHovering) && enableEffects) {
    className += ' text-transparent';
  } else {
    className += ' text-white';
  }
  if (isHovering && enableEffects) className += ' shake';

  // Remove onClick to allow default navigation
  return (
    <Link
      ref={elementRef}
      key={index}
      href={link.href}
      className={className}
      style={(isActive || isHovering) && enableEffects ? gradientStyle : {}}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      scroll={link.href !== '/#contact'}
    >
      {link.text}
    </Link>
  );
};

export default function ClientLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/services", text: "Services" },
    { href: "/portfolio", text: "Portfolio" },
    { href: "/about", text: "About" },
    { href: "/#contact", text: "Contact" },
    { href: "/admin/login", text: "Admin" },
  ];

  // Debugging
  useEffect(() => {
    console.log('Mobile menu open:', isMenuOpen);
  }, [isMenuOpen]);

  // For smooth scroll to #contact on homepage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname]);

  // Close mobile menu after navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      <nav className="fixed w-full z-[100] bg-[#121212]/90 backdrop-blur-sm border-b border-[#333333]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text"
          >
            CB
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <NavItem
                key={index}
                link={link}
                index={index}
                navLinksCount={navLinks.length}
                pathname={pathname}
                closeMenu={() => setIsMenuOpen(false)}
                isMobile={false}
              />
            ))}
          </div>

          <button className="md:hidden z-[101]" onClick={() => { setIsMenuOpen(!isMenuOpen); console.log('Hamburger clicked, menu open:', !isMenuOpen); }}>
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="text-2xl text-white" />
          </button>

          <Link
            href="/#contact"
            className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity hidden md:block"
          >
            Get in Touch
          </Link>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A1A1A] py-4 fixed top-0 left-0 w-full h-full z-[100] overflow-y-auto">
            <div className="container mx-auto px-4 pt-20">
              {navLinks.map((link, index) => (
                <NavItem
                  key={index}
                  link={link}
                  index={index}
                  navLinksCount={navLinks.length}
                  pathname={pathname}
                  closeMenu={() => setIsMenuOpen(false)}
                  isMobile={true}
                />
              ))}
            </div>
          </div>
        )}
      </nav>
      <main>{children}</main>
      {!isAdminRoute && <ChatWidget />}
    </>
  );
} 