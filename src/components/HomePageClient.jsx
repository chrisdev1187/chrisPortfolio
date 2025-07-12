"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faChevronDown,
  faArrowRight,
  faQuoteLeft,
  faChevronLeft,
  faChevronRight,
  faCode,
  faBrain,
  faVrCardboard,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import ContactForm from './ContactForm';

export default function HomePageClient({ projects, services, contactData, profileImage, testimonials }) {
  const [activeProject, setActiveProject] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // At the top, ensure SUPABASE_MEDIA_URL is defined for both dev and prod
  const SUPABASE_MEDIA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chrisp/`
    : 'https://afbvjxbvbszonmmpunei.supabase.co/storage/v1/object/public/chrisp/';
  const profileImageUrl = SUPABASE_MEDIA_URL + 'public/media/profile.jpg';

  // When mapping projects for rendering, filter out duplicates and update image URLs
  const seen = new Set();
  const filteredProjects = projects
    .map(project => {
      // Ensure image_url uses Supabase Storage URL
      let updatedProject = { ...project };
      if (updatedProject.image_url && !updatedProject.image_url.startsWith('http')) {
        updatedProject.image_url = SUPABASE_MEDIA_URL + updatedProject.image_url.replace('/media/', 'public/media/');
      }
      return updatedProject;
    })
    .filter(project => {
      const key = (project.slug || project.title).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#121212] opacity-80"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 rounded-full blur-[150px]"></div>
        </div>

        <div 
          className="container mx-auto px-4 z-10 tilt-card"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <div className="max-w-3xl mx-auto text-center tilt-card-content">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Creative{" "}
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Technology
              </span>{" "}
              & Digital Art
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              I'm Christiaan Bothma, a creative technologist merging code,
              design, and art to create immersive digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#projects"
                className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a
            href="#services"
            className="text-2xl text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-[#1A1A1A]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Services
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Specialized expertise at the intersection of technology, design,
              and art to bring your digital vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#121212] p-8 rounded-lg border border-[#333333] hover:border-[#00FFFF] transition-colors group"
              >
                <div className="text-4xl mb-6 text-[#00FFFF] group-hover:text-[#FF00FF] transition-colors">
                  <FontAwesomeIcon icon={service.icon} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/services"
              className="px-6 py-3 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors inline-flex items-center"
            >
              <span className="mr-2">View All Services</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A selection of my recent work spanning interactive experiences, AI
              applications, and digital art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-lg border border-[#333333] hover:border-[#00FFFF] transition-colors"
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image_url || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm text-[#00FFFF] mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p
                    className={`text-gray-300 transition-all duration-300 ${
                      activeProject === project.id
                        ? "max-h-20 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/portfolio"
              className="px-6 py-3 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors inline-flex items-center"
            >
              <span className="mr-2">View All Projects</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#333333] mx-auto relative z-10">
                <img
                  src={profileImageUrl}
                  alt="Christiaan Bothma portrait"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = '/media/image-error.png'; }}
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 rounded-full blur-[50px] -z-10"></div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  About Me
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                I'm a creative technologist and digital artist with a passion
                for merging cutting-edge technology with artistic expression. I
                specialize in creating immersive digital experiences that push
                the boundaries of what's possible on the web.
              </p>
              <p className="text-xl text-gray-300 mb-8">
                With expertise in interactive development, AI integration, and
                immersive technologies, I help brands, artists, and
                organizations bring their digital visions to life.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/about"
                  className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                >
                  Learn More
                </Link>
                <a
                  href="#contact"
                  className="px-6 py-3 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-2">
                50+
              </div>
              <p className="text-gray-300">Projects Completed</p>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-2">
                10+
              </div>
              <p className="text-gray-300">Years Experience</p>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-2">
                30+
              </div>
              <p className="text-gray-300">Happy Clients</p>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-2">
                15+
              </div>
              <p className="text-gray-300">Awards Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Client Testimonials
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              What clients say about working with me.
            </p>
          </div>

          {testimonials && testimonials.length > 0 && (
            <div className="max-w-4xl mx-auto bg-[#121212] p-8 md:p-12 rounded-lg border border-[#333333] relative">
              <div className="text-4xl text-[#00FFFF] mb-6">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <p className="text-xl md:text-2xl text-gray-300 italic mb-8 h-36">
                {testimonials[currentTestimonial].quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={`${testimonials[currentTestimonial].name} portrait`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{testimonials[currentTestimonial].name}</h3>
                  <p className="text-sm text-gray-400">{testimonials[currentTestimonial].company}</p>
                </div>
              </div>
              
              {testimonials.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-white opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-white opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Get in Touch
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear
              from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <p className="text-gray-300 mb-6">
                  Feel free to reach out through any of these channels or use
                  the contact form.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-[#00FFFF] mt-1 mr-4">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="text-gray-300">
                        <a href={`mailto:${contactData.email}`} className="hover:underline">{contactData.email}</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-[#00FFFF] mt-1 mr-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                      <h4 className="font-bold">Location</h4>
                      <p className="text-gray-300">{contactData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-[#00FFFF] mt-1 mr-4">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>
                      <h4 className="font-bold">Phone</h4>
                      <p className="text-gray-300">
                        <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="hover:underline">{contactData.phone}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a
                    href={contactData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#00FFFF] transition-colors"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href={contactData.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#00FFFF] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href={contactData.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#00FFFF] transition-colors"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#333333]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-2">
                Christiaan Bothma
              </div>
              <p className="text-gray-400">Creating digital experiences</p>
            </div>

            {/* Remove this block for social media links */}
            {/*
            <div className="flex space-x-6">
              <a
                href={contactData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00FFFF] text-xl"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href={contactData.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00FFFF] text-xl"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href={contactData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00FFFF] text-xl"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
            */}
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Christiaan Bothma. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 