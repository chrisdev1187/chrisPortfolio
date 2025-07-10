"use client";
import React, { useState, useEffect } from "react";

export default function ContactAdminPage() {
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    address: "",
    social: { github: "", linkedin: "", twitter: "" },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setContact(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.message || "Failed to save changes");
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Contact & Social Media</h2>
        <div className="text-gray-400 mb-2">Edit contact details and social media links.</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="flex flex-col">
            <span className="mb-1">Email</span>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Phone</span>
            <input
              type="text"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
            />
          </label>
          <label className="flex flex-col md:col-span-2">
            <span className="mb-1">Address</span>
            <input
              type="text"
              name="address"
              value={contact.address}
              onChange={handleChange}
              className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
            />
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col">
              <span className="mb-1">GitHub</span>
              <input
                type="text"
                name="github"
                value={contact.social.github}
                onChange={handleSocialChange}
                className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">LinkedIn</span>
              <input
                type="text"
                name="linkedin"
                value={contact.social.linkedin}
                onChange={handleSocialChange}
                className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Twitter</span>
              <input
                type="text"
                name="twitter"
                value={contact.social.twitter}
                onChange={handleSocialChange}
                className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {success && <div className="text-green-400 mt-2">Saved!</div>}
      </div>
    </div>
  );
} 