"use client";
import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'ContactForm',
        }),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('An error occurred. Please try again.');
    } finally {
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#333333]">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none text-white"
            placeholder="Your name"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none text-white"
            placeholder="Your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className="block mb-2 font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none text-white"
            placeholder="Subject"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block mb-2 font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-md focus:border-[#00FFFF] focus:outline-none text-white resize-none"
            placeholder="Your message"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>
      {status && (
        <p className="mt-4 text-center text-green-400">{status}</p>
      )}
    </div>
  );
} 