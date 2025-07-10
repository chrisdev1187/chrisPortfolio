"use client";
import React, { useState, useEffect } from "react";

export default function AboutAdminPage() {
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        setProfilePicture(data.profilePicture || "");
        setBio(data.bio || "");
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture, bio }),
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
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        <div className="text-gray-400 mb-2">Update your profile picture and bio.</div>
        <div className="flex items-center mb-4">
          <img
            src={profilePicture || "/profile.jpg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-[#333333] mr-4"
          />
          <input
            type="text"
            className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white w-full"
            placeholder="Profile picture URL"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <textarea
          className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4"
          rows={4}
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
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