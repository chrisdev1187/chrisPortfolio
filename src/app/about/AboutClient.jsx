"use client";
import React from 'react';
import ClientLayout from '@/components/ClientLayout';

export default function AboutClient({ testimonials }) {
  const [activeTab, setActiveTab] = React.useState("mission");

  const skills = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 95 },
    { name: "Node.js", level: 85 },
    { name: "UI/UX Design", level: 80 },
    { name: "TensorFlow", level: 70 },
    { name: "WordPress", level: 80 },
    { name: "Adobe Creative Suite", level: 85 },
    { name: "Prompt Engineering", level: 75 },
  ];

  const technologies = [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "TensorFlow",
    "React Native",
    "GraphQL",
    "AWS",
    "Firebase",
    "Docker",
    "Git",
    "Figma",
    "Adobe Creative Suite",
    "WordPress",
    "Prompt Engineering",
  ];

  const SUPABASE_MEDIA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chrisp/`
    : 'https://afbvjxbvbszonmmpunei.supabase.co/storage/v1/object/public/chrisp/';
  const profileImageUrl = SUPABASE_MEDIA_URL + 'public/media/profile.jpg';

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#121212] text-white font-poppins">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[#121212] opacity-90"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  About{" "}
                  <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                    Me
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  I'm Christiaan Bothma, a creative technologist and digital
                  artist with a passion for merging cutting-edge technology with
                  artistic expression. I specialize in creating immersive digital
                  experiences that push the boundaries of what's possible on the
                  web.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                  >
                    Get in Touch
                  </a>
                  <a
                    href="/portfolio"
                    className="px-6 py-3 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors"
                  >
                    View My Work
                  </a>
                </div>
              </div>
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
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-16 px-4 bg-[#1A1A1A]">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveTab("mission")}
                className={`px-6 py-2 rounded-full border ${
                  activeTab === "mission"
                    ? "bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black border-transparent"
                    : "border-[#333333] hover:border-[#00FFFF] transition-colors"
                }`}
              >
                My Mission
              </button>
              <button
                onClick={() => setActiveTab("philosophy")}
                className={`px-6 py-2 rounded-full border ${
                  activeTab === "philosophy"
                    ? "bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black border-transparent"
                    : "border-[#333333] hover:border-[#00FFFF] transition-colors"
                }`}
              >
                My Philosophy
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-6 py-2 rounded-full border ${
                  activeTab === "skills"
                    ? "bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black border-transparent"
                    : "border-[#333333] hover:border-[#00FFFF] transition-colors"
                }`}
              >
                Skills & Technologies
              </button>
            </div>

            <div className="bg-[#121212] border border-[#333333] rounded-lg p-8">
              {activeTab === "mission" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                      My Mission
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-gray-300 mb-4">
                        My mission is to bridge the gap between technology and
                        art, creating digital experiences that are not only
                        functional but emotionally resonant. I believe that the
                        most impactful digital products are those that connect
                        with users on a human level.
                      </p>
                      <p className="text-gray-300 mb-4">
                        I'm dedicated to pushing the boundaries of what's possible
                        in digital spaces, exploring new technologies like AI, AR,
                        and interactive media to create experiences that surprise
                        and delight users while solving real problems.
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-4">
                        I strive to create work that is accessible, inclusive, and
                        considerate of diverse user needs. I believe technology
                        should serve humanity, not the other way around, and I'm
                        committed to ethical practices in all my projects.
                      </p>
                      <p className="text-gray-300">
                        Through my work, I aim to inspire others to see technology
                        as a creative medium and to encourage more artists and
                        designers to explore the possibilities of digital tools
                        for expression and innovation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "philosophy" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                      My Philosophy
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                      <div className="text-3xl text-[#00FFFF] mb-4">
                        <i className="fa-solid fa-lightbulb"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-3">Innovation First</h3>
                      <p className="text-gray-300">
                        I believe in pushing boundaries and exploring new
                        possibilities. Every project is an opportunity to innovate
                        and create something that hasn't been done before. I'm
                        constantly learning and experimenting with emerging
                        technologies.
                      </p>
                    </div>

                    <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                      <div className="text-3xl text-[#FF00FF] mb-4">
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-3">Human-Centered</h3>
                      <p className="text-gray-300">
                        Technology should serve people, not the other way around.
                        I design with empathy, considering the diverse needs,
                        abilities, and contexts of users. Accessibility and
                        inclusivity are not afterthoughts but core principles in
                        my work.
                      </p>
                    </div>

                    <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                      <div className="text-3xl text-[#00FFFF] mb-4">
                        <i className="fa-solid fa-code-branch"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        Interdisciplinary
                      </h3>
                      <p className="text-gray-300">
                        The most interesting solutions emerge at the intersection
                        of different fields. I draw inspiration from art, science,
                        nature, and culture, bringing diverse perspectives to
                        solve complex problems and create meaningful experiences.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <blockquote className="border-l-4 border-gradient-to-r from-[#00FFFF] to-[#FF00FF] pl-6 py-2 italic text-xl text-gray-300">
                      "Technology is best when it brings people together. My goal
                      is to create digital experiences that don't just impress
                      with technical prowess, but connect with people on an
                      emotional level and enhance their lives in meaningful ways."
                    </blockquote>
                    <p className="text-right mt-4 text-gray-400">
                      — Christiaan Bothma
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                      Skills & Technologies
                    </span>
                  </h2>

                  <div className="mb-12">
                    <h3 className="text-xl font-bold mb-6">Core Competencies</h3>
                    <div className="space-y-6">
                      {skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-gray-400">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-[#333333] rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-6">
                      Technologies I Work With
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Services I Offer</h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                          <i className="fa-solid fa-check text-[#00FFFF] mt-1 mr-3"></i>
                          <span>Interactive Web Experiences</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-check text-[#00FFFF] mt-1 mr-3"></i>
                          <span>AI-Powered Applications</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-check text-[#00FFFF] mt-1 mr-3"></i>
                          <span>Creative Technology Consulting</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-check text-[#00FFFF] mt-1 mr-3"></i>
                          <span>Digital Art & Installations</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-check text-[#00FFFF] mt-1 mr-3"></i>
                          <span>Frontend Development</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        Continuous Learning
                      </h3>
                      <p className="text-gray-300 mb-4">
                        I'm committed to continuous growth and staying at the
                        forefront of technology. Currently exploring:
                      </p>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                          <i className="fa-solid fa-arrow-trend-up text-[#FF00FF] mt-1 mr-3"></i>
                          <span>
                            Advanced AI/ML Applications in Creative Fields
                          </span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-arrow-trend-up text-[#FF00FF] mt-1 mr-3"></i>
                          <span>WebXR and Immersive Web Experiences</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa-solid fa-arrow-trend-up text-[#FF00FF] mt-1 mr-3"></i>
                          <span>Generative Art and Creative Coding</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                What People Say
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(testimonials) && testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.name} portrait`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 p-8 rounded-lg max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Build the Future?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Let's collaborate to create something extraordinary. Whether you
                have a specific project in mind or just want to explore ideas, I'm
                here to help bring your digital vision to life.
              </p>
              <a
                href="/home#contact"
                className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity inline-block"
              >
                Let's Talk
              </a>
            </div>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
} 