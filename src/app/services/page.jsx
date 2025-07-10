"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCode,
  faMobileScreen,
  faBrain,
  faLightbulb,
  faCheck,
  faWandMagicSparkles,
  faGaugeHigh,
  faUserGroup,
  faRocket,
  faCircleCheck,
  faXmark,
  faBars // Added for the mobile menu button
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCode,
  faMobileScreen,
  faBrain,
  faLightbulb,
  faCheck,
  faWandMagicSparkles,
  faGaugeHigh,
  faUserGroup,
  faRocket,
  faCircleCheck,
  faXmark,
  faBars
);

import ClientLayout from '@/components/ClientLayout';

function MainComponent() {
  const [activeService, setActiveService] = useState("webDevelopment");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Web Development",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  const services = [
    {
      id: "webDevelopment",
      title: "Web Development",
      icon: "code",
      shortDesc:
        "Custom websites and web applications with cutting-edge technologies",
      fullDesc:
        "I create bespoke websites and web applications that combine stunning design with powerful functionality. Using modern frameworks like React and Next.js, I build responsive, accessible, and performant digital experiences that help businesses stand out online.",
      features: [
        "Custom website design and development",
        "Progressive Web Applications (PWAs)",
        "E-commerce solutions",
        "Content Management Systems",
        "Web performance optimization",
        "Responsive design for all devices",
      ],
      technologies: [
        "React",
        "Next.js",
        "TailwindCSS",
        "Node.js",
        "GraphQL",
        "WebGL",
      ],
    },
    {
      id: "appDevelopment",
      title: "App Development",
      icon: "mobile-screen",
      shortDesc:
        "Native and cross-platform mobile applications for iOS and Android",
      fullDesc:
        "I develop intuitive, high-performance mobile applications that provide seamless user experiences across platforms. Whether you need a native iOS/Android app or a cross-platform solution, I deliver mobile experiences that users love.",
      features: [
        "Native iOS and Android development",
        "Cross-platform solutions with React Native",
        "App UI/UX design",
        "App performance optimization",
        "Integration with device features",
        "App Store submission assistance",
      ],
      technologies: [
        "React Native",
        "Swift",
        "Kotlin",
        "Firebase",
        "Redux",
        "Native APIs",
      ],
    },
    {
      id: "aiServices",
      title: "AI Creative Services",
      icon: "brain",
      shortDesc: "AI-powered solutions that push creative boundaries",
      fullDesc:
        "I leverage artificial intelligence to create innovative digital experiences that were previously impossible. From generative art installations to AI-powered user interfaces, I help businesses and artists explore the creative potential of machine learning.",
      features: [
        "AI-powered web experiences",
        "Generative art and design",
        "Machine learning integration",
        "Computer vision applications",
        "Natural language processing solutions",
        "AI chatbots and assistants",
      ],
      technologies: [
        "TensorFlow.js",
        "ML5.js",
        "Python",
        "OpenAI API",
        "Computer Vision",
        "NLP",
      ],
    },
    {
      id: "technicalConsulting",
      title: "Technical Consulting",
      icon: "lightbulb",
      shortDesc: "Expert guidance on digital strategy and implementation",
      fullDesc:
        "I provide strategic technical consulting to help businesses navigate the complex digital landscape. From technology selection to implementation roadmaps, I offer expert guidance to ensure your digital initiatives succeed.",
      features: [
        "Digital transformation strategy",
        "Technology stack selection",
        "Technical architecture design",
        "Code reviews and optimization",
        "Team training and workshops",
        "Technical due diligence",
      ],
      technologies: [
        "System Architecture",
        "DevOps",
        "Cloud Services",
        "Performance Optimization",
        "Security",
        "Scalability",
      ],
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Discovery",
      description:
        "We begin with a thorough consultation to understand your goals, requirements, and vision. This phase involves research, stakeholder interviews, and defining clear objectives.",
    },
    {
      number: "02",
      title: "Strategy",
      description:
        "Based on our discovery findings, I develop a comprehensive strategy that outlines the technical approach, timeline, and deliverables to achieve your goals effectively.",
    },
    {
      number: "03",
      title: "Design",
      description:
        "I create detailed wireframes and visual designs that bring your vision to life, focusing on user experience, brand consistency, and innovative interactions.",
    },
    {
      number: "04",
      title: "Development",
      description:
        "Using cutting-edge technologies, I build your solution with clean, efficient code. Regular updates and iterative development ensure you're involved throughout the process.",
    },
    {
      number: "05",
      title: "Testing",
      description:
        "Rigorous testing across devices and platforms ensures your product works flawlessly. I test for performance, accessibility, and user experience to deliver a polished final product.",
    },
    {
      number: "06",
      title: "Launch",
      description:
        "Once approved, I handle the deployment process, ensuring a smooth launch. I provide documentation and support to help you manage your new digital asset.",
    },
    {
      number: "07",
      title: "Maintenance",
      description:
        "Our relationship doesn't end at launch. I offer ongoing support and maintenance to keep your digital product secure, up-to-date, and performing optimally.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitted(false);

    if (!formData.name || !formData.email || !formData.message) {
      setFormError("Please fill out all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Project Request: ${formData.service}`,
          message: formData.message,
          type: 'Project Request',
          source: 'ServicesForm',
        }),
      });

      if (response.ok) {
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      service: "Web Development",
      message: "",
    });
      } else {
        setFormError("Failed to send your request. Please try again later.");
      }
    } catch (error) {
      console.error("Project request form error:", error);
      setFormError("An error occurred. Please try again later.");
    }
  };

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
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  Services
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                I combine technical expertise with creative vision to deliver
                digital solutions that are not just functional, but
                transformative. Explore my services and let's bring your ideas to
                life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#serviceContact"
                  className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                >
                  Start a Project
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 px-4 bg-[#1A1A1A]">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                What I Offer
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
                    activeService === service.id
                      ? "bg-gradient-to-br from-[#1A1A1A] to-[#252525] border-[#00FFFF]"
                      : "bg-[#121212] border-[#333333] hover:border-[#00FFFF]/50"
                  }`}
                  onClick={() => setActiveService(service.id)}
                >
                  <div
                    className={`text-4xl mb-4 ${
                      activeService === service.id
                        ? "text-[#00FFFF]"
                        : "text-gray-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-300">{service.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className={`transition-opacity duration-500 ${
                  activeService === service.id ? "block" : "hidden"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-6">
                      <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                        {service.title}
                      </span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                      {service.fullDesc}
                    </p>

                    <h3 className="text-xl font-bold mb-4">What's Included</h3>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-[#00FFFF] mt-1 mr-3" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#serviceContact"
                      className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity inline-block"
                    >
                      Discuss Your Project
                    </a>
                  </div>

                  <div className="md:w-1/2">
                    <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-8 h-full">
                      <h3 className="text-xl font-bold mb-6">
                        Technologies I Use
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-8">
                        {service.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#121212] border border-[#333333] rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold mb-6">Why Choose Me</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="text-2xl text-[#00FFFF] mr-4">
                            <FontAwesomeIcon icon={faWandMagicSparkles} />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">Creative Approach</h4>
                            <p className="text-gray-300 text-sm">
                              I bring a unique blend of technical expertise and
                              creative vision to every project.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="text-2xl text-[#00FFFF] mr-4">
                            <FontAwesomeIcon icon={faGaugeHigh} />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">Performance Focus</h4>
                            <p className="text-gray-300 text-sm">
                              I build solutions that are not just beautiful, but
                              fast, responsive, and optimized.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="text-2xl text-[#00FFFF] mr-4">
                            <FontAwesomeIcon icon={faUserGroup} />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">
                              Collaborative Process
                            </h4>
                            <p className="text-gray-300 text-sm">
                              I work closely with you throughout the project,
                              ensuring your vision is realized.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="text-2xl text-[#00FFFF] mr-4">
                            <FontAwesomeIcon icon={faRocket} />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">
                              Future-Proof Solutions
                            </h4>
                            <p className="text-gray-300 text-sm">
                              I build with scalability and future expansion in
                              mind, using the latest technologies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 px-4 bg-[#1A1A1A]">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                My Process
              </span>
            </h2>

            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#333333] -translate-x-1/2"></div>

              <div className="space-y-12 md:space-y-0">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`flex flex-col md:flex-row items-center ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                        <div className="w-16 h-16 rounded-full bg-[#121212] border-2 border-[#333333] flex items-center justify-center relative z-10">
                          <span className="text-xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}
                      >
                        <div className="bg-[#121212] p-6 rounded-lg border border-[#333333]">
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-gray-300">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  How long does a typical project take?
                </h3>
                <p className="text-gray-300">
                  Project timelines vary based on complexity and scope. A simple
                  website might take 2-4 weeks, while a complex application could
                  take 2-3 months. During our initial consultation, I'll provide a
                  detailed timeline specific to your project.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  What is your pricing structure?
                </h3>
                <p className="text-gray-300">
                  I offer both project-based and hourly pricing options. Each
                  project is unique, so I provide custom quotes based on your
                  specific requirements, timeline, and complexity. I'm transparent
                  about costs and will work within your budget constraints.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  Do you offer ongoing maintenance?
                </h3>
                <p className="text-gray-300">
                  Yes, I offer maintenance packages to keep your digital products
                  secure, up-to-date, and performing optimally. These can include
                  regular updates, security patches, performance monitoring, and
                  content updates as needed.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  How involved will I be in the process?
                </h3>
                <p className="text-gray-300">
                  I believe in collaborative development. You'll be involved
                  throughout the process with regular updates, feedback sessions,
                  and progress demonstrations. Your input is crucial to ensuring
                  the final product aligns with your vision.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  Do you work with clients remotely?
                </h3>
                <p className="text-gray-300">
                  Yes, I work with clients globally. Using collaborative tools and
                  regular video calls, I maintain clear communication throughout
                  the project regardless of location. Time zone differences are
                  managed to ensure smooth collaboration.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-bold mb-3">
                  What happens if I need changes after launch?
                </h3>
                <p className="text-gray-300">
                  Post-launch revisions are a natural part of the process. Minor
                  adjustments are typically included in the project scope. For
                  more substantial changes, I offer flexible options including
                  hourly rates or additional project phases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="serviceContact" className="py-16 px-4 bg-[#1A1A1A]">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  Start Your Project
                </span>
              </h2>

              <div className="bg-[#121212] p-8 rounded-lg border border-[#333333]">
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-5xl text-[#00FFFF] mb-6">
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Thank you for reaching out. I'll review your project details
                      and get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {formError && (
                      <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-md text-red-200">
                        <p>{formError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 font-medium">
                          Your Name <span className="text-[#FF00FF]">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#1A1A1A] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium">
                          Your Email <span className="text-[#FF00FF]">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-[#1A1A1A] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="service" className="block mb-2 font-medium">
                        Service You're Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#1A1A1A] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="AI Creative Services">
                          AI Creative Services
                        </option>
                        <option value="Technical Consulting">
                          Technical Consulting
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block mb-2 font-medium">
                        Project Details <span className="text-[#FF00FF]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full p-3 bg-[#1A1A1A] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none"
                        placeholder="Tell me about your project, goals, and timeline..."
                      ></textarea>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                )}
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

              <div className="flex space-x-6">
                <a
                  href="https://github.com/christiaanbothma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFFF] text-xl"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://twitter.com/christiaanbothma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFFF] text-xl"
                >
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a
                  href="https://linkedin.com/in/christiaanbothma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFFF] text-xl"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a
                  href="https://instagram.com/christiaanbothma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00FFFF] text-xl"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              © 2025 Christiaan Bothma. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </ClientLayout>
  );
}

export default MainComponent;