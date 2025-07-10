"use client";
import React, { useState, useEffect, useCallback } from "react";

import { useUpload } from "@/utilities/runtime-helpers";

function MainComponent() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    text: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [upload, { loading: uploading }] = useUpload();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "getAll" }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching testimonials: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      } else {
        throw new Error(data.message || "Failed to fetch testimonials");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // REMOVE ALL AUTH CHECKS AND LOADING
  // Always render the testimonials admin page

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        title: testimonial.title,
        text: testimonial.text,
        image: null,
      });
      setImagePreview(testimonial.image_url);
    } else {
      setCurrentTestimonial(null);
      setFormData({
        name: "",
        title: "",
        text: "",
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTestimonial(null);
    setFormData({
      name: "",
      title: "",
      text: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentTestimonial?.image_url || null;

      // Upload image if a new one was selected
      if (formData.image) {
        const uploadResult = await upload({ file: formData.image });
        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }
        imageUrl = uploadResult.url;
      }

      const testimonialData = {
        name: formData.name,
        title: formData.title,
        text: formData.text,
        image_url: imageUrl,
      };

      const action = currentTestimonial ? "update" : "create";
      const payload = {
        action,
        testimonial: testimonialData,
      };

      if (currentTestimonial) {
        payload.testimonial.id = currentTestimonial.id;
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${
            action === "create" ? "creating" : "updating"
          } testimonial: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        closeModal();
      } else {
        throw new Error(data.message || `Failed to ${action} testimonial`);
      }
    } catch (err) {
      console.error(err);
      setError(
        `Failed to ${currentTestimonial ? "update" : "create"} testimonial. ${
          err.message
        }`
      );
    }
  };

  const openDeleteConfirm = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setTestimonialToDelete(null);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          id: testimonialToDelete.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting testimonial: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        closeDeleteConfirm();
      } else {
        throw new Error(data.message || "Failed to delete testimonial");
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to delete testimonial. ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#1A1A1A] border-r border-[#333333] p-6 hidden md:block">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text mb-8">
          CB Admin
        </div>

        <nav className="space-y-2">
          <a
            href="/admin"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-gauge-high mr-2"></i> Dashboard
          </a>
          <a
            href="/admin/projects"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-briefcase mr-2"></i> Projects
          </a>
          <a
            href="/admin/services"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-server mr-2"></i> Services
          </a>
          <a
            href="/admin/testimonials"
            className="block py-2 px-4 rounded bg-[#252525] text-[#00FFFF]"
          >
            <i className="fa-solid fa-quote-left mr-2"></i> Testimonials
          </a>
          <a
            href="/admin/media"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-images mr-2"></i> Media
          </a>
          <a
            href="/admin/settings"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-gear mr-2"></i> Settings
          </a>
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <a
            href="/home"
            className="block py-2 px-4 rounded hover:bg-[#252525] transition-colors"
          >
            <i className="fa-solid fa-globe mr-2"></i> View Site
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/admin/login";
            }}
            className="block w-full text-left py-2 px-4 rounded hover:bg-[#252525] transition-colors text-red-400"
          >
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-[#1A1A1A] border-b border-[#333333] p-4 sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
            CB Admin
          </div>
          <button className="text-white">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Testimonials Management</h1>
          <p className="text-gray-400">
            Add, edit, and manage client testimonials displayed on your website.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-200 hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">All Testimonials</h2>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add New
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fa-solid fa-quote-left text-4xl mb-4 opacity-30"></i>
              <p>
                No testimonials found. Add your first client testimonial to get
                started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-[#252525] border border-[#333333] rounded-lg overflow-hidden"
                >
                  <div className="h-48 overflow-hidden bg-[#1A1A1A]">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={`${testimonial.name} portrait`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <i className="fa-solid fa-user text-4xl"></i>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {testimonial.image_url && (
                        <img
                          src={testimonial.image_url}
                          alt={`${testimonial.name} portrait`}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        {testimonial.image_url && (
                          <div className="text-xs text-gray-400">{testimonial.image_url.split('/').pop()}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {testimonial.title}
                    </p>
                    <p className="text-gray-300 italic text-sm mb-4 line-clamp-3">
                      "{testimonial.text}"
                    </p>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openModal(testimonial)}
                        className="p-2 text-[#00FFFF] hover:bg-[#333333] rounded transition-colors"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(testimonial)}
                        className="p-2 text-red-400 hover:bg-[#333333] rounded transition-colors"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#333333]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {currentTestimonial
                    ? "Edit Testimonial"
                    : "Add New Testimonial"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="name">
                    Client Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="title">
                    Client Title/Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                    placeholder="CEO, Company Name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="text">
                  Testimonial Text <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                  placeholder="What the client said about your work..."
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="image">
                  Client Image
                </label>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full bg-[#252525] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Recommended size: 400x400px. Max file size: 2MB.
                    </p>
                  </div>

                  <div className="w-20 h-20 bg-[#252525] border border-[#333333] rounded-md overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fa-solid fa-user text-gray-500 text-2xl"></i>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-[#333333] rounded-md hover:bg-[#252525] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity flex items-center"
                >
                  {uploading && (
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                  )}
                  {currentTestimonial
                    ? "Update Testimonial"
                    : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-[#333333]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Confirm Delete</h2>
                <button
                  onClick={closeDeleteConfirm}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="mb-6">
                Are you sure you want to delete the testimonial from{" "}
                <span className="font-bold">{testimonialToDelete?.name}</span>?
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 border border-[#333333] rounded-md hover:bg-[#252525] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Testimonial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;