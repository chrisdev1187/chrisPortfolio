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

const NavItem = ({ link, index, navLinksCount, pathname, handleContactClick, closeMenu, isMobile }) => {
  const [hash, setHash] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const [contactTempActive, setContactTempActive] = useState(false);
  const contactTimeoutRef = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    };
  }, []);

  // Determine if this nav item is active
  let isActive = false;
  const isContact = link.href === '/#contact';
  if (isContact) {
    isActive = contactTempActive;
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

  // Confetti on click
  const handleClick = (e) => {
    if ((isActive || isHovering) && enableEffects) {
      const rect = elementRef.current.getBoundingClientRect();
      const origin = {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.bottom) / 2 / window.innerHeight
      };
      confetti({
        particleCount: 50,
        spread: 21,
        origin: origin,
        colors: ['#007bff', '#366ac7', '#6d58d0', '#a446d8', '#d235e0', '#e83e8c']
      });
    }
    if (isContact) {
      setContactTempActive(true);
      if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = setTimeout(() => setContactTempActive(false), 5000);
      handleContactClick(e);
    }
    if (!isContact && isMobile) {
      closeMenu();
    }
  };

  // Render
  if (isContact) {
    return (
      <a
        ref={elementRef}
        key={index}
        href={link.href}
        className={className}
        style={(isActive || isHovering) && enableEffects ? gradientStyle : {}}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {link.text}
      </a>
    );
  }
  return (
    <Link
      ref={elementRef}
      key={index}
      href={link.href}
      className={className}
      style={(isActive || isHovering) && enableEffects ? gradientStyle : {}}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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

  const handleContactClick = (e) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, '', '#contact');
      }
    } else {
      router.push("/#contact");
    }
  };

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      <nav className="fixed w-full z-50 bg-[#121212]/90 backdrop-blur-sm border-b border-[#333333]">
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
                handleContactClick={handleContactClick}
                closeMenu={() => setIsMenuOpen(false)}
                isMobile={false}
              />
            ))}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="text-2xl text-white" />
          </button>

          <a
            href="/#contact"
            onClick={handleContactClick}
            className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity hidden md:block"
          >
            Get in Touch
          </a>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A1A1A] py-4">
            {navLinks.map((link, index) => (
              <NavItem
                key={index}
                link={link}
                index={index}
                navLinksCount={navLinks.length}
                pathname={pathname}
                handleContactClick={handleContactClick}
                closeMenu={() => setIsMenuOpen(false)}
                isMobile={true}
              />
            ))}
          </div>
        )}
      </nav>
      <main>{children}</main>
      {!isAdminRoute && <ChatWidget />}
    </>
  );
} 