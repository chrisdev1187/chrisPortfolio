"use client";
import React, { useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// const IconPicker = dynamic(() => import("../components/IconPicker"), { ssr: false });

export default function ServicesAdminPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // const [iconPicker, setIconPicker] = useState({ open: false, idx: null, field: null, bulletIdx: null }); // Removed IconPicker state
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" }),
      });
      const data = await res.json();
      if (data.success) setServices(data.services);
      else setError(data.message || "Failed to fetch services");
    } catch (err) {
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (idx, field, value) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleFeatureChange = (idx, fIdx, value) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, features: s.features.map((f, j) => (j === fIdx ? value : f)) }
          : s
      )
    );
  };

  const handleAddFeature = (idx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, features: [...s.features, ""] } : s
      )
    );
  };

  const handleRemoveFeature = (idx, fIdx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, features: s.features.filter((_, j) => j !== fIdx) }
          : s
      )
    );
  };

  const handleTechTagChange = (idx, tIdx, value) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, techTags: s.techTags.map((t, j) => (j === tIdx ? value : t)) }
          : s
      )
    );
  };

  const handleAddTechTag = (idx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, techTags: [...s.techTags, ""] } : s
      )
    );
  };

  const handleRemoveTechTag = (idx, tIdx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, techTags: s.techTags.filter((_, j) => j !== tIdx) }
          : s
      )
    );
  };

  const handleTechBulletChange = (idx, bIdx, field, value) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              techBullets: s.techBullets.map((b, j) =>
                j === bIdx ? { ...b, [field]: value } : b
              ),
            }
          : s
      )
    );
  };

  const handleAddTechBullet = (idx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, techBullets: [...s.techBullets, { icon: "", text: "" }] }
          : s
      )
    );
  };

  const handleRemoveTechBullet = (idx, bIdx) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, techBullets: s.techBullets.filter((_, j) => j !== bIdx) }
          : s
      )
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateAll", services }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.message || "Failed to save changes");
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Services Management</h1>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {success && <div className="text-green-400 mb-4">Saved!</div>}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {services.map((service, idx) => (
              <div key={service.id} className="bg-[#1A1A1A] border border-[#333333] rounded-lg mb-8">
                {/* --- Primary Section --- */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <label className="block mb-2 font-bold">Service Title</label>
                      <input type="text" value={service.title} onChange={e => handleServiceChange(idx, "title", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" />

                      <label className="block mb-2 font-bold">Sub Text</label>
                      <input type="text" value={service.subText} onChange={e => handleServiceChange(idx, "subText", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" />
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block mb-2 font-bold">CTA Button Text</label>
                          <input type="text" value={service.ctaText} onChange={e => handleServiceChange(idx, "ctaText", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </div>
                        <div className="flex-1">
                          <label className="block mb-2 font-bold">CTA Button Link</label>
                          <input type="text" value={service.ctaLink} onChange={e => handleServiceChange(idx, "ctaLink", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </div>
                      </div>

                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <label className="block mb-2 font-bold text-center">Icon</label>
                      {/* IconPicker button replaced with simple input for class name */}
                      <input type="text" value={service.icon} onChange={e => handleServiceChange(idx, "icon", e.target.value)} className="w-24 h-24 bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white text-center flex items-center justify-center" placeholder="fa-solid fa-icon" />
                    </div>
                  </div>
                </div>

                {/* --- Toggle Bar --- */}
                <div 
                  className="bg-[#222222] px-6 py-2 flex justify-between items-center cursor-pointer hover:bg-[#2a2a2a]"
                  onClick={() => toggleExpand(idx)}
                >
                  <span className="font-bold">More Details</span>
                  <i className={`fa-solid fa-chevron-down transition-transform ${expanded[idx] ? 'rotate-180' : ''}`}></i>
                </div>
                
                {/* --- Secondary (Collapsible) Section --- */}
                {expanded[idx] && (
                  <div className="p-6 border-t border-[#333333]">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left Side: What's Included */}
                      <div className="md:w-1/2">
                        <label className="block mb-2 font-bold">Full Description</label>
                        <textarea value={service.fullDesc} onChange={e => handleServiceChange(idx, "fullDesc", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" rows={3} />
                        
                        <label className="block mb-2 font-bold">What's Included Title</label>
                        <input type="text" value={service.whatsIncludedTitle} onChange={e => handleServiceChange(idx, "whatsIncludedTitle", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" />
                        
                        <label className="block mb-2 font-bold">Features (bullets)</label>
                        {service.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center mb-2">
                            <input type="text" value={feature} onChange={e => handleFeatureChange(idx, fIdx, e.target.value)} className="flex-1 bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                            <button type="button" onClick={() => handleRemoveFeature(idx, fIdx)} className="ml-2 px-2 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-xs">Remove</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleAddFeature(idx)} className="px-3 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-xs mb-4">Add Feature</button>
                      </div>

                      {/* Right Side: Tech Stack */}
                      <div className="md:w-1/2">
                        <label className="block mb-2 font-bold">Tech Section Title</label>
                        <input type="text" value={service.techSectionTitle} onChange={e => handleServiceChange(idx, "techSectionTitle", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" />
                        
                        <label className="block mb-2 font-bold">Tech Tags</label>
                        {service.techTags.map((tag, tIdx) => (
                          <div key={tIdx} className="flex items-center mb-2">
                            <input type="text" value={tag} onChange={e => handleTechTagChange(idx, tIdx, e.target.value)} className="flex-1 bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                            <button type="button" onClick={() => handleRemoveTechTag(idx, tIdx)} className="ml-2 px-2 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-xs">Remove</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleAddTechTag(idx)} className="px-3 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-xs mb-4">Add Tag</button>
                        
                        <label className="block mb-2 font-bold">Tech Main Title</label>
                        <input type="text" value={service.techMainTitle} onChange={e => handleServiceChange(idx, "techMainTitle", e.target.value)} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4" />
                        
                        <label className="block mb-2 font-bold">Tech Bullets (icon + text)</label>
                        {service.techBullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-center mb-2 gap-2">
                            <button type="button" onClick={() => setIconPicker({ open: true, idx, field: "techBullets", bulletIdx: bIdx })} className="w-1/3 flex items-center gap-2 px-2 py-2 bg-[#222222] border border-[#333333] rounded-md text-white">
                              <i className={bullet.icon + " text-2xl"}></i>
                              <span className="truncate">{bullet.icon || "Select Icon"}</span>
                            </button>
                            <input type="text" value={bullet.text} onChange={e => handleTechBulletChange(idx, bIdx, "text", e.target.value)} className="flex-1 bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" placeholder="Bullet text" />
                            <button type="button" onClick={() => handleRemoveTechBullet(idx, bIdx)} className="px-2 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-xs">Remove</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => handleAddTechBullet(idx)} className="px-3 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-xs mb-4">Add Tech Bullet</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity mt-6">Save All Changes</button>
            {iconPicker.open && (
              <IconPicker
                value={iconPicker.field === "icon" ? services[iconPicker.idx].icon : services[iconPicker.idx].techBullets[iconPicker.bulletIdx].icon}
                onSelect={(icon) => {
                  if (iconPicker.field === "icon") {
                    handleServiceChange(iconPicker.idx, "icon", icon);
                  } else if (iconPicker.field === "techBullets") {
                    handleTechBulletChange(iconPicker.idx, iconPicker.bulletIdx, "icon", icon);
                  }
                }}
                onClose={() => setIconPicker({ open: false, idx: null, field: null, bulletIdx: null })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 