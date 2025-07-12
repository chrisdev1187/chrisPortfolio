"use client";
import React, { useState, useEffect } from "react";

const referencedImages = [
  "/profile.jpg",
  "/testimonial1.jpg",
  "/mission.jpg",
  "/testimonial2.jpg",
  "/testimonial3.jpg"
];

export default function MediaAdminPage() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMediaFiles(data.files || []);
    } catch (err) {
      setError("Failed to load media files");
    }
  };

  const handleUpload = async (e, filename) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData();
    formData.append("file", file, filename || file.name);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        fetchMedia();
        
        // If this is replacing the profile image, update the about data
        if (filename === "profile.jpg") {
          try {
            const aboutRes = await fetch("/api/about");
            const aboutData = await aboutRes.json();
            aboutData.profilePicture = `/media/${data.filename}`;
            
            await fetch("/api/about", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(aboutData),
            });
          } catch (aboutErr) {
            console.error("Failed to update about data:", aboutErr);
          }
        }
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      const res = await fetch(`/api/media?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchMedia();
      } else {
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed");
    }
  };

  // Combine referenced images and uploaded media
  const allImages = Array.from(new Set([
    ...referencedImages.map((img) => img.replace(/^\//, "")),
    ...mediaFiles
  ]));

  const SUPABASE_MEDIA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chrisp/`
    : 'https://afbvjxbvbszonmmpunei.supabase.co/storage/v1/object/public/chrisp/';

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins flex flex-col items-center py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Media Management</h1>
        <div className="mb-6">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleUpload(e)}
            disabled={uploading}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00FFFF]/10 file:text-[#00FFFF] hover:file:bg-[#00FFFF]/20"
          />
          {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
          {error && <div className="text-red-400 mt-2">{error}</div>}
          {success && <div className="text-green-400 mt-2">Uploaded!</div>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allImages.map((file) => (
            <div key={file} className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 flex flex-col items-center">
              {file.endsWith(".mp4") || file.endsWith(".webm") || file.endsWith(".ogg") ? (
                <video
                  src={file.startsWith('http') ? file : SUPABASE_MEDIA_URL + file.replace('/media/', 'public/media/')}
                  alt={file}
                  className="w-full h-32 object-cover rounded mb-2"
                  controls
                  onError={e => { e.target.onerror = null; e.target.poster = '/media/video-error.png'; }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={file.startsWith('http') ? file : SUPABASE_MEDIA_URL + file.replace('/media/', 'public/media/')}
                  alt={file}
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={e => { e.target.onerror = null; e.target.src = "/media/image-error.png"; }}
                />
              )}
              <div className="text-xs truncate w-full mb-2">{file}</div>
              <div className="flex space-x-2">
                <label className="px-2 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-xs cursor-pointer">
                  Replace
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, file)}
                  />
                </label>
                <button
                  onClick={() => handleDelete(file)}
                  className="px-2 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 