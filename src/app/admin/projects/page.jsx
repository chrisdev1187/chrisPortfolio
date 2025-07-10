"use client";
import React, { useState, useEffect, useRef } from "react";

const ICON_OPTIONS = [
  { label: 'Graphic Design', value: 'graphic-design', icon: '🎨' },
  { label: 'Marketing', value: 'marketing', icon: '📈' },
  { label: 'Web', value: 'web', icon: '💻' },
  { label: 'App', value: 'app', icon: '📱' },
  { label: 'Consulting', value: 'consulting', icon: '🧑‍💼' },
  { label: 'SEO', value: 'seo', icon: '🔍' },
  { label: 'Email', value: 'email', icon: '✉️' },
  { label: 'Video', value: 'video', icon: '🎬' },
  { label: 'Photography', value: 'photography', icon: '📷' },
  { label: 'Branding', value: 'branding', icon: '🏷️' },
  { label: 'Social Media', value: 'social-media', icon: '📱' },
  { label: 'Content Creation', value: 'content-creation', icon: '📝' },
  { label: 'Copywriting', value: 'copywriting', icon: '✍️' },
  { label: 'Animation', value: 'animation', icon: '🎞️' },
  { label: 'E-commerce', value: 'ecommerce', icon: '🛒' },
  { label: 'Analytics', value: 'analytics', icon: '📊' },
  { label: 'Print', value: 'print', icon: '🖨️' },
  { label: 'Events', value: 'events', icon: '🎤' },
  { label: 'Support', value: 'support', icon: '🛠️' },
  { label: 'Strategy', value: 'strategy', icon: '🧠' },
  { label: 'Ads', value: 'ads', icon: '💡' },
  { label: 'UI/UX', value: 'uiux', icon: '🖱️' },
  { label: 'Podcast', value: 'podcast', icon: '🎙️' },
  { label: 'Newsletter', value: 'newsletter', icon: '📰' },
  { label: 'Mobile', value: 'mobile', icon: '📲' },
  { label: 'Cloud', value: 'cloud', icon: '☁️' },
  { label: 'Hosting', value: 'hosting', icon: '🌐' },
  { label: 'Maintenance', value: 'maintenance', icon: '🔧' },
  // Add more as needed
];

const SOCIAL_MEDIA_OPTIONS = [
  { label: 'Instagram', value: 'instagram', icon: '📸' },
  { label: 'Facebook', value: 'facebook', icon: '📘' },
  { label: 'Twitter', value: 'twitter', icon: '🐦' },
  { label: 'LinkedIn', value: 'linkedin', icon: '💼' },
  { label: 'YouTube', value: 'youtube', icon: '▶️' },
  { label: 'TikTok', value: 'tiktok', icon: '🎵' },
  // Add more as needed
];

const PROJECT_TYPES = [
  {
    key: 'normal',
    label: 'Normal Project',
    icon: '🗂️',
    description: 'Full-featured project',
    disabled: false, // Enable normal project type
  },
  {
    key: 'images',
    label: 'Image Library',
    icon: '🖼️',
    description: 'A gallery of design images with design tool icons',
    disabled: false,
  },
  {
    key: 'videos',
    label: 'Video Library',
    icon: '🎬',
    description: 'A gallery of videos with video tool icons',
    disabled: false,
  },
  {
    key: 'websites',
    label: 'Website Library',
    icon: '🌐',
    description: 'A collection of website/app links with live previews',
    disabled: false,
  },
  {
    key: 'apps',
    label: 'Apps',
    icon: '📱',
    description: 'A collection of app links with live previews',
    disabled: false,
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: '\uf09b', // GitHub FontAwesome icon
    description: 'A GitHub open source project with stats and overview',
    disabled: false
  }
];

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentProject, setCurrentProject] = useState(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showAdditionalImagesSelector, setShowAdditionalImagesSelector] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPdfUploadModal, setShowPdfUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    full_description: "",
    image_url: "",
    additional_images: [],
    pdfs: [],
    client: "",
    duration: "",
    technologies: [],
    tags: [],
    challenge: "",
    solution: "",
    results: "",
    project_link: "",
    featured: false,
    display_order: 0,
    videos: [],
    icons: [],
    designs: [],
    socialMedia: {},
    pages: [], // New field for website pages
    github_stats: null
  });
  const formRef = useRef();
  const [activeSection, setActiveSection] = useState("section-basic");
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [showDesignSelector, setShowDesignSelector] = useState(false);
  const [projectType, setProjectType] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchMedia();
  }, []);

  useEffect(() => {
    if (!isFormOpen) return;
    const handleScroll = () => {
      const sectionIds = [
        "section-basic",
        "section-image",
        "section-gallery",
        "section-pdf",
        "section-details",
      ];
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - 100 < 0) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    const formEl = formRef.current;
    formEl && formEl.addEventListener("scroll", handleScroll);
    return () => {
      formEl && formEl.removeEventListener("scroll", handleScroll);
    };
  }, [isFormOpen]);

  const handleSidebarClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el && formRef.current) {
      formRef.current.scrollTo({
        top: el.offsetTop - 24,
        behavior: "smooth",
      });
      // Close mobile sidebar after clicking a link
      setShowMobileSidebar(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" }),
      });
      const data = await res.json();
      if (data.success) setProjects(data.projects);
      else setError(data.message || "Failed to fetch projects");
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" }),
      });
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMediaFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };

  const handleAdd = () => {
    setProjectType(null);
    setShowTypeModal(true);
  };

  const handleTypeSelect = (type) => {
    setProjectType(type);
    setShowTypeModal(false);
    setFormMode('create');
    setForm({
      title: '',
      category: type === 'images' ? 'designs' : type === 'videos' ? 'videos' : type === 'github' ? 'github' : '',
      description: '',
      full_description: '',
      image_url: '',
      additional_images: [],
      pdfs: [],
      client: '',
      duration: '',
      technologies: [],
      tags: [],
      challenge: '',
      solution: '',
      results: '',
      project_link: '',
      featured: false,
      display_order: projects.length,
      videos: [],
      icons: [],
      designs: [],
      socialMedia: {},
      pages: [], // Reset pages for new project type
      github_stats: type === 'github' ? { languages: {}, stars: 0, forks: 0, issues: 0 } : undefined
    });
    setCurrentProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setFormMode("edit");
    setForm({ ...project });
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", projectId: id }),
      });
      const data = await res.json();
      if (data.success) fetchProjects();
      else setError(data.message || "Delete failed");
    } catch (err) {
      setError("Delete failed");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "technologies" || name === "tags") {
      setForm((prev) => ({ ...prev, [name]: value.split(",").map((s) => s.trim()).filter(Boolean) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaSelect = (mediaFile) => {
    setForm((prev) => ({ ...prev, image_url: `/media/${mediaFile}` }));
    setShowMediaSelector(false);
  };

  const handleAdditionalImageSelect = (mediaFile) => {
    setForm((prev) => ({ 
      ...prev, 
      additional_images: [...(prev.additional_images || []), `/media/${mediaFile}`] 
    }));
    setShowAdditionalImagesSelector(false);
  };

  const handleRemoveAdditionalImage = (index) => {
    setForm((prev) => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }
      }

      // Refresh media files list
      await fetchMedia();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitForm = { ...form };
    // Force category for website library or apps
    if (projectType === 'websites') {
      submitForm.category = 'websites';
    }
    if (projectType === 'apps') {
      submitForm.category = 'app';
    }
    setLoading(true);
    try {
      let body;
      if (formMode === 'edit') {
        body = {
          action: 'update',
          projectId: currentProject.id,
          projectData: submitForm
        };
      } else {
        body = {
          action: 'create',
          projectData: submitForm
        };
      }
      const res = await fetch("/api/projects", {
        method: formMode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
        setIsFormOpen(false);
      } else {
        setError(data.message || "Failed to save project");
      }
    } catch (err) {
      setError("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  // Add a new function to open the Design Selector and ensure media is refreshed
  const openDesignSelector = async () => {
    await fetchMedia();
    setShowDesignSelector(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins p-8">
      <div className="max-w-5xl mx-auto mt-8" style={{ marginTop: 30 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add New Project
          </button>
        </div>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 flex flex-col">
                <div className="flex items-center mb-2">
                  <img src={project.image_url || "/media/profile.jpg"} alt={project.title} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <h2 className="font-bold text-lg">{project.title}</h2>
                    <div className="text-xs text-gray-400">{project.category}</div>
                  </div>
                </div>
                <div className="text-gray-400 mb-2">{project.description}</div>
                {/* GitHub Stats Preview */}
                {project.category === 'github' && project.github_stats && (
                  <div className="text-xs text-gray-400 mb-2">
                    <strong>Languages:</strong> {
                      project.github_stats.languages
                        ? (typeof project.github_stats.languages === 'object'
                            ? Object.entries(project.github_stats.languages).map(([lang, percent]) => `${lang}: ${percent}%`).join(', ')
                            : String(project.github_stats.languages))
                        : 'N/A'
                    }<br/>
                    <strong>Stars:</strong> {project.github_stats.stars ?? 'N/A'} | <strong>Forks:</strong> {project.github_stats.forks ?? 'N/A'} | <strong>Issues:</strong> {project.github_stats.issues ?? 'N/A'}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies && project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-[#222222] rounded text-xs">{tech}</span>
                  ))}
                </div>
                {project.additional_images && project.additional_images.length > 0 && (
                  <div className="text-xs text-gray-400 mb-2">
                    <i className="fa-solid fa-images mr-1"></i>
                    {project.additional_images.length} additional image{project.additional_images.length !== 1 ? 's' : ''}
                  </div>
                )}
                {project.designs && project.designs.length > 0 && (
                  <div className="text-xs text-gray-400 mb-2">
                    <i className="fa-solid fa-palette mr-1"></i>
                    {project.designs.length} design{project.designs.length !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="flex space-x-2 mt-auto">
                  <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-xs">
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-xs">
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showTypeModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#181818] border border-[#333333] rounded-lg p-8 max-w-lg w-full relative flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 text-center">Select Project Type</h2>
              <div className="flex space-x-8 mb-6">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.key}
                    disabled={type.disabled}
                    onClick={() => !type.disabled && handleTypeSelect(type.key)}
                    className={`flex flex-col items-center px-6 py-4 rounded-lg border-2 transition-all duration-300
                      ${projectType === type.key ? 'border-[#00FFFF] bg-[#222] scale-110 shadow-lg animate-bounce' : 'border-[#333] bg-[#181818]'}
                      ${type.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-[#00FFFF] hover:bg-[#222]'}
                    `}
                    style={{ minWidth: 120 }}
                  >
                    <span className={`text-5xl mb-2 transition-all duration-300 ${projectType === type.key ? 'text-[#00FFFF] drop-shadow-lg' : ''}`}>{type.icon}</span>
                    <span className="font-semibold mb-1">{type.label}</span>
                    <span className="text-xs text-gray-400 text-center">{type.description}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTypeModal(false)} className="mt-2 px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444]">Cancel</button>
            </div>
          </div>
        )}
        {isFormOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-0 w-full max-w-4xl relative flex min-h-[80vh]">
                {/* Sidebar Navigation */}
                <nav className={`w-48 border-r border-[#333333] bg-[#181818] py-8 px-4 sticky top-0 h-full ${showMobileSidebar ? 'block' : 'hidden'} md:block`}>
                  <div className="flex justify-between items-center mb-6 md:hidden">
                    <h3 className="text-lg font-semibold">Navigation</h3>
                    <button 
                      onClick={() => setShowMobileSidebar(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                  </div>
                  <ul className="space-y-4 text-sm">
                    <li><a href="#section-basic" className={`sidebar-link${activeSection === "section-basic" ? " active" : ""}`} onClick={e => handleSidebarClick(e, "section-basic")}>Basic Info</a></li>
                    <li><a href="#section-image" className={`sidebar-link${activeSection === "section-image" ? " active" : ""}`} onClick={e => handleSidebarClick(e, "section-image")}>Main Image</a></li>
                    <li><a href="#section-gallery" className={`sidebar-link${activeSection === "section-gallery" ? " active" : ""}`} onClick={e => handleSidebarClick(e, "section-gallery")}>Gallery</a></li>
                    <li><a href="#section-pdf" className={`sidebar-link${activeSection === "section-pdf" ? " active" : ""}`} onClick={e => handleSidebarClick(e, "section-pdf")}>PDFs</a></li>
                    <li><a href="#section-details" className={`sidebar-link${activeSection === "section-details" ? " active" : ""}`} onClick={e => handleSidebarClick(e, "section-details")}>Details</a></li>
                  </ul>
                </nav>
                {/* Form Content */}
                <form ref={formRef} onSubmit={handleSubmit} className="flex-1 p-8 overflow-y-auto relative max-h-[80vh]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <button 
                        type="button" 
                        onClick={() => setShowMobileSidebar(true)}
                        className="md:hidden text-gray-400 hover:text-white"
                      >
                        <i className="fa-solid fa-bars text-xl"></i>
                      </button>
                      <h2 className="text-xl font-bold">{formMode === "create" ? "Add Project" : "Edit Project"}</h2>
                    </div>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">
                      <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GitHub Project Type Fields */}
                    {(projectType === 'github' || form.category === 'github') ? (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">GitHub Project Details</h3>
                        </div>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Description</span>
                          <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Additional Images (for thumbnail collage)</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowAdditionalImagesSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add Images
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.additional_images && form.additional_images.length > 0 && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {form.additional_images.map((image, index) => (
                                  <div key={index} className="relative group aspect-square">
                                    <img 
                                      src={image} 
                                      alt={`Gallery ${index + 1}`} 
                                      className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer" 
                                      onError={(e) => e.target.style.display = 'none'}
                                      onClick={() => setSelectedImage(image)}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                      <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAdditionalImage(index);
                                      }}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm text-gray-400">
                                Click on images to view full size. All images are displayed in uniform square format for consistent gallery layout.
                              </div>
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">GitHub Project Link</span>
                          <input
                            type="url"
                            name="project_link"
                            value={form.project_link || ''}
                            onChange={handleFormChange}
                            className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                            placeholder="https://github.com/username/repo"
                          />
                        </label>
                        {/* GitHub Stats Section */}
                        <div className="col-span-2 mb-4">
                          <h4 className="text-md font-semibold mb-2 text-[#00FFFF]">GitHub Stats</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block mb-2">
                              <span className="mb-1 block">Languages (JSON: {'{"JavaScript":70,"CSS":20}'})</span>
                              {(() => { console.log('DEBUG LANGUAGES VALUE:', form.github_stats && form.github_stats.languages, typeof (form.github_stats && form.github_stats.languages)); return null; })()}
                              <input
                                type="text"
                                name="languages"
                                value={
                                  (() => {
                                    const val = form.github_stats && form.github_stats.languages;
                                    if (!val) return '';
                                    if (typeof val === 'string') {
                                      try {
                                        const parsed = JSON.parse(val);
                                        if (typeof parsed === 'object' && parsed !== null) return JSON.stringify(parsed);
                                        return val;
                                      } catch {
                                        return val;
                                      }
                                    }
                                    if (typeof val === 'object') return JSON.stringify(val);
                                    return '';
                                  })()
                                }
                                onChange={e => {
                                  let val = {};
                                  try { val = JSON.parse(e.target.value); } catch { val = {}; }
                                  setForm(prev => ({ ...prev, github_stats: { ...prev.github_stats, languages: val } }));
                                }}
                                className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                                placeholder='{"JavaScript":70,"CSS":20}'
                              />
                            </label>
                            <label className="block mb-2">
                              <span className="mb-1 block">Stars</span>
                              <input
                                type="number"
                                name="stars"
                                value={form.github_stats && form.github_stats.stars !== undefined ? form.github_stats.stars : ''}
                                onChange={e => setForm(prev => ({ ...prev, github_stats: { ...prev.github_stats, stars: Number(e.target.value) } }))}
                                className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                              />
                            </label>
                            <label className="block mb-2">
                              <span className="mb-1 block">Forks</span>
                              <input
                                type="number"
                                name="forks"
                                value={form.github_stats && form.github_stats.forks !== undefined ? form.github_stats.forks : ''}
                                onChange={e => setForm(prev => ({ ...prev, github_stats: { ...prev.github_stats, forks: Number(e.target.value) } }))}
                                className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                              />
                            </label>
                            <label className="block mb-2">
                              <span className="mb-1 block">Open Issues</span>
                              <input
                                type="number"
                                name="issues"
                                value={form.github_stats && form.github_stats.issues !== undefined ? form.github_stats.issues : ''}
                                onChange={e => setForm(prev => ({ ...prev, github_stats: { ...prev.github_stats, issues: Number(e.target.value) } }))}
                                className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                              />
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="col-span-2 mt-4 px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">{formMode === "create" ? "Create GitHub Project" : "Update GitHub Project"}</button>
                      </>
                    ) : null}
                    {/* End GitHub Project Type Fields */}
                    {/* Basic Info */}
                    {(projectType === 'normal' || !projectType) && (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">Basic Project Details</h3>
                        </div>
                        <label className="block mb-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <input type="hidden" name="category" value="designs" />
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Description</span>
                          <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Full Description</span>
                          <textarea name="full_description" value={form.full_description} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={4} />
                        </label>
                        <label className="block mb-2">
                          <span className="mb-1 block">Main Image</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowMediaSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Select Image
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.image_url && (
                            <div className="relative aspect-square w-full rounded-lg border border-[#333333] overflow-hidden">
                              <img 
                                src={form.image_url} 
                                alt="Main Project Image" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Additional Images</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowAdditionalImagesSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add Images
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.additional_images && form.additional_images.length > 0 && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {form.additional_images.map((image, index) => (
                                  <div key={index} className="relative group aspect-square">
                                    <img 
                                      src={image} 
                                      alt={`Gallery ${index + 1}`} 
                                      className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer" 
                                      onError={(e) => e.target.style.display = 'none'}
                                      onClick={() => setSelectedImage(image)}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                      <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAdditionalImage(index);
                                      }}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm text-gray-400">
                                Click on images to view full size. All images are displayed in uniform square format for consistent gallery layout.
                              </div>
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">PDFs</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowPdfUploadModal(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add PDFs
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.pdfs && form.pdfs.length > 0 && (
                            <div className="space-y-2">
                              {form.pdfs.map((pdf, index) => (
                                <div key={index} className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-md p-2">
                                  <span>{pdf.displayName}</span>
                                  <button
                                    type="button"
                                    onClick={() => setForm(prev => ({
                                      ...prev,
                                      pdfs: prev.pdfs.filter((_, i) => i !== index)
                                    }))}
                                    className="text-red-400 hover:text-red-300 text-lg"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Client</span>
                          <input type="text" name="client" value={form.client} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Duration</span>
                          <input type="text" name="duration" value={form.duration} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Technologies</span>
                          <input type="text" name="technologies" value={form.technologies.join(', ')} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Tags</span>
                          <input type="text" name="tags" value={form.tags.join(', ')} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Challenge</span>
                          <textarea name="challenge" value={form.challenge} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Solution</span>
                          <textarea name="solution" value={form.solution} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Results</span>
                          <textarea name="results" value={form.results} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Website/App Link</span>
                          <input
                            type="url"
                            name="project_link"
                            value={form.project_link || ''}
                            onChange={handleFormChange}
                            className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                            placeholder="https://example.com or app link"
                          />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Featured</span>
                          <input type="checkbox" name="featured" checked={form.featured} onChange={handleFormChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Display Order</span>
                          <input type="number" name="display_order" value={form.display_order} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Videos</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowVideoSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add Local Videos
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          
                          {/* YouTube Video URL Input */}
                          <div className="mb-4">
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                placeholder="Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                                className="flex-1 bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const url = e.target.value.trim();
                                    if (url && !form.videos.includes(url)) {
                                      setForm(prev => ({
                                        ...prev,
                                        videos: [...(prev.videos || []), url]
                                      }));
                                      e.target.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  const input = e.target.previousElementSibling;
                                  const url = input.value.trim();
                                  if (url && !form.videos.includes(url)) {
                                    setForm(prev => ({
                                      ...prev,
                                      videos: [...(prev.videos || []), url]
                                    }));
                                    input.value = '';
                                  }
                                }}
                                className="px-4 py-2 bg-[#FF0000] text-white rounded hover:bg-opacity-80 text-sm"
                              >
                                Add YouTube
                              </button>
                            </div>
                          </div>
                          
                          {form.videos && form.videos.length > 0 && (
                            <div className="space-y-2">
                              {form.videos.map((video, index) => (
                                <div key={index} className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-md p-2">
                                  <span className="truncate flex-1 mr-2">
                                    {video.includes('youtube.com') || video.includes('youtu.be') ? (
                                      <span className="text-red-400">
                                        <i className="fab fa-youtube mr-2"></i>
                                        YouTube Video
                                      </span>
                                    ) : (
                                      video
                                    )}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setForm(prev => ({
                                      ...prev,
                                      videos: prev.videos.filter((_, i) => i !== index)
                                    }))}
                                    className="text-red-400 hover:text-red-300 text-lg flex-shrink-0"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Designs</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowDesignSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add Designs
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.designs && form.designs.length > 0 && (
                            <div className="space-y-2">
                              {form.designs.map((design, index) => (
                                <div key={index} className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-md p-2">
                                  <span>{design}</span>
                                  <button
                                    type="button"
                                    onClick={() => setForm(prev => ({
                                      ...prev,
                                      designs: prev.designs.filter((_, i) => i !== index)
                                    }))}
                                    className="text-red-400 hover:text-red-300 text-lg"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Social Media</span>
                          <div className="grid grid-cols-2 gap-2">
                            {["instagram", "facebook", "tiktok"].map((platform) => (
                              <div key={platform} className="flex flex-col space-y-1">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={!!form.socialMedia?.[platform]}
                                    onChange={e => {
                                      setForm(prev => ({
                                        ...prev,
                                        socialMedia: {
                                          ...prev.socialMedia,
                                          [platform]: e.target.checked ? (prev.socialMedia?.[platform] || "") : undefined
                                        }
                                      }));
                                    }}
                                  />
                                  <span className="mr-2 text-gray-400">{SOCIAL_MEDIA_OPTIONS.find(opt => opt.value === platform)?.label || platform}</span>
                                </label>
                                {form.socialMedia?.[platform] !== undefined && (
                                  <input
                                    type="text"
                                    name={`socialMedia.${platform}`}
                                    value={form.socialMedia[platform]}
                                    onChange={e => {
                                      setForm(prev => ({
                                        ...prev,
                                        socialMedia: {
                                          ...prev.socialMedia,
                                          [platform]: e.target.value
                                        }
                                      }));
                                    }}
                                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                                    placeholder={`Enter ${platform} link`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </label>
                      </>
                    )}
                    {projectType === 'images' && (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">Design Library Details</h3>
                        </div>
                        <label className="block mb-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <input type="hidden" name="category" value="designs" />
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Description</span>
                          <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        {/* Tool Icon Selection */}
                        <div className="mb-4">
                          <span className="mb-1 block font-semibold">Design Tools Used</span>
                          <div className="flex gap-3 flex-wrap">
                            {[
                              { label: 'Illustrator', value: 'illustrator', icon: <span style={{color:'#FF9A00'}}>🅰️</span> },
                              { label: 'Photoshop', value: 'photoshop', icon: <span style={{color:'#00C8FF'}}>🅿️</span> },
                              { label: 'Canva', value: 'canva', icon: <span style={{color:'#00C4CC'}}>🅲</span> },
                              { label: 'InDesign', value: 'indesign', icon: <span style={{color:'#FF3366'}}>🅸</span> },
                              { label: 'Figma', value: 'figma', icon: <span style={{color:'#A259FF'}}>🅵</span> },
                            ].map(opt => (
                              <button
                                type="button"
                                key={opt.value}
                                className={`flex flex-col items-center px-3 py-2 rounded border transition-colors text-sm font-medium ${Array.isArray(form.icons) && form.icons.includes(opt.value) ? 'bg-[#00FFFF] text-black border-transparent scale-110 shadow-lg' : 'bg-[#222222] border-[#333333] text-white hover:border-[#00FFFF]'}`}
                                onClick={() => setForm(prev => ({
                                  ...prev,
                                  icons: Array.isArray(prev.icons)
                                    ? (prev.icons.includes(opt.value)
                                        ? prev.icons.filter(i => i !== opt.value)
                                        : [...prev.icons, opt.value])
                                    : [opt.value]
                                }))}
                              >
                                <span className="text-3xl mb-1">{opt.icon}</span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">Select all that apply. These icons will display on the project card and modal.</div>
                        </div>
                      </>
                    )}
                    {projectType === 'videos' && (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">Video Library Details</h3>
                        </div>
                        <label className="block mb-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <input type="hidden" name="category" value="videos" />
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Description</span>
                          <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" rows={2} />
                        </label>
                        <label className="block mb-2 md:col-span-2">
                          <span className="mb-1 block">Video Files</span>
                          <div className="flex space-x-2 mb-2">
                            <button 
                              type="button"
                              onClick={() => setShowVideoSelector(true)}
                              className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Add Videos
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowUploadModal(true)}
                              className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                            >
                              Upload New
                            </button>
                          </div>
                          {form.videos && form.videos.length > 0 && (
                            <div className="space-y-2">
                              {form.videos.map((video, index) => (
                                <div key={index} className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-md p-2">
                                  <span>{video}</span>
                                  <button
                                    type="button"
                                    onClick={() => setForm(prev => ({
                                      ...prev,
                                      videos: prev.videos.filter((_, i) => i !== index)
                                    }))}
                                    className="text-red-400 hover:text-red-300 text-lg"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </label>
                      </>
                    )}
                    {projectType === 'apps' && (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">App Details</h3>
                        </div>
                        <label className="block mb-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <label className="block mb-2">
                          <span className="mb-1 block">App/Website Link</span>
                          <input type="url" name="project_link" value={form.project_link} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" placeholder="https://example.com" required />
                        </label>
                        <input type="hidden" name="category" value="app" />
                      </>
                    )}
                    {projectType === 'websites' && (
                      <>
                        <div id="section-basic" className="col-span-2 mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">Website Library Details</h3>
                        </div>
                        <label className="block mb-2">
                          <span className="mb-1 block">Title</span>
                          <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" required />
                        </label>
                        <label className="block mb-2">
                          <span className="mb-1 block">Website/App Link</span>
                          <input type="url" name="project_link" value={form.project_link} onChange={handleFormChange} className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white" placeholder="https://example.com" required />
                        </label>
                        <input type="hidden" name="category" value="websites" />
                      </>
                    )}
                    <div id="section-gallery" className="col-span-2 mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-[#00FFFF] border-b border-[#333333] pb-2">Image Gallery</h3>
                    </div>
                    <label className="block mb-2 md:col-span-2">
                      <span className="mb-1 block">Gallery Images</span>
                      <div className="flex space-x-2 mb-2">
                        <button 
                          type="button"
                          onClick={() => setShowAdditionalImagesSelector(true)}
                          className="px-3 py-2 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                        >
                          Add Images
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                        >
                          Upload New
                        </button>
                      </div>
                      {form.additional_images && form.additional_images.length > 0 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {form.additional_images.map((image, index) => (
                              <div key={index} className="relative group aspect-square">
                                <img 
                                  src={image} 
                                  alt={`Gallery ${index + 1}`} 
                                  className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer" 
                                  onError={(e) => e.target.style.display = 'none'}
                                  onClick={() => setSelectedImage(image)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                  <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAdditionalImage(index);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-gray-400">
                            Click on images to view full size. All images are displayed in uniform square format for consistent gallery layout.
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity">
                      {formMode === "create" ? "Add Project" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <style jsx global>{`
            .sidebar-link {
              display: block;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              color: #fff;
              transition: background 0.2s, color 0.2s;
            }
            .sidebar-link.active, .sidebar-link:focus {
              background: linear-gradient(to right, #00FFFF, #FF00FF);
              color: #121212;
            }
            `}</style>
          </>
        )}
        
        {/* Media Selector Modal */}
        {showMediaSelector && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Media</h2>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="px-3 py-1 bg-[#FF00FF] text-black rounded hover:bg-opacity-80 text-sm"
                  >
                    Upload New
                  </button>
                  <button 
                    onClick={() => setShowMediaSelector(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fa-solid fa-xmark text-2xl"></i>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaFiles.map((file) => (
                  <div 
                    key={file} 
                    className="bg-[#222222] border border-[#333333] rounded-lg p-2 cursor-pointer hover:border-[#00FFFF] transition-colors"
                    onClick={() => handleMediaSelect(file)}
                  >
                    <div className="aspect-square mb-2">
                      <img 
                        src={`/media/${file}`} 
                        alt={file} 
                        className="w-full h-full object-cover rounded"
                        onError={(e) => e.target.src = "/media/profile.jpg"}
                      />
                    </div>
                    <div className="text-xs truncate text-center">{file}</div>
                  </div>
                ))}
              </div>
              {mediaFiles.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No media files found. Upload some images first.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Additional Images Selector Modal */}
        {showAdditionalImagesSelector && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Additional {form.category === 'videos' ? 'Videos' : 'Images'}</h2>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="px-3 py-1 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                  >
                    Upload New
                  </button>
                  <button 
                    onClick={() => setShowAdditionalImagesSelector(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fa-solid fa-xmark text-2xl"></i>
                  </button>
                </div>
              </div>
              {/* Filter and slice files by project type */}
              {(() => {
                let filesToShow = [];
                if (form.category === 'videos') {
                  // Only show video files
                  const videoFiles = mediaFiles.filter(f => f.match(/\.(mp4|webm|ogg)$/i));
                  filesToShow = showAllImages ? videoFiles : videoFiles.slice(-10);
                  return (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filesToShow.map((file) => (
                          <div 
                            key={file} 
                            className="bg-[#222222] border border-[#333333] rounded-lg p-2 cursor-pointer hover:border-[#FF00FF] transition-colors"
                            onClick={() => handleAdditionalImageSelect(file)}
                          >
                            <div className="aspect-square mb-2 flex items-center justify-center bg-black/40">
                              <video 
                                src={`/media/${file}`} 
                                className="w-full h-full object-cover rounded"
                                style={{ maxHeight: '80px' }}
                                controls={false}
                                preload="metadata"
                              />
                            </div>
                            <div className="text-xs truncate text-center">{file}</div>
                          </div>
                        ))}
                      </div>
                      {videoFiles.length > 10 && (
                        <div className="flex justify-center mt-4">
                          <button
                            className="px-4 py-2 bg-[#333333] text-white rounded hover:bg-[#444444] transition-colors"
                            onClick={() => setShowAllImages(v => !v)}
                          >
                            {showAllImages ? 'Show Less' : `Show All (${videoFiles.length})`}
                          </button>
                        </div>
                      )}
                      {videoFiles.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          No video files found. Upload some videos first.
                        </div>
                      )}
                    </>
                  );
                } else {
                  // Only show image files
                  const imageFiles = mediaFiles.filter(f => f.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i));
                  filesToShow = showAllImages ? imageFiles : imageFiles.slice(-10);
                  return (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filesToShow.map((file) => (
                          <div 
                            key={file} 
                            className="bg-[#222222] border border-[#333333] rounded-lg p-2 cursor-pointer hover:border-[#FF00FF] transition-colors"
                            onClick={() => handleAdditionalImageSelect(file)}
                          >
                            <div className="aspect-square mb-2">
                              <img 
                                src={`/media/${file}`} 
                                alt={file} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => e.target.src = "/media/profile.jpg"}
                              />
                            </div>
                            <div className="text-xs truncate text-center">{file}</div>
                          </div>
                        ))}
                      </div>
                      {imageFiles.length > 10 && (
                        <div className="flex justify-center mt-4">
                          <button
                            className="px-4 py-2 bg-[#333333] text-white rounded hover:bg-[#444444] transition-colors"
                            onClick={() => setShowAllImages(v => !v)}
                          >
                            {showAllImages ? 'Show Less' : `Show All (${imageFiles.length})`}
                          </button>
                        </div>
                      )}
                      {imageFiles.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          No image files found. Upload some images first.
                        </div>
                      )}
                    </>
                  );
                }
              })()}
            </div>
          </div>
        )}
        
        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload Media</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00FFFF] file:text-black hover:file:bg-opacity-80"
                />
              </div>
              
              {uploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFFF] mr-3"></div>
                  <span>Uploading...</span>
                </div>
              )}
              
              <div className="text-sm text-gray-400 mb-4">
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                <p>• Maximum file size: 10MB per file</p>
                <p>• You can select multiple files at once</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-[#333333] text-white rounded hover:bg-[#444444] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* PDF Upload Modal */}
        {showPdfUploadModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload PDF</h2>
                <button 
                  onClick={() => setShowPdfUploadModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const response = await fetch('/api/media', {
                        method: 'POST',
                        body: formData,
                      });
                      if (!response.ok) throw new Error('Upload failed');
                      const data = await response.json();
                      const url = data.url || `/media/${file.name}`;
                      setForm(prev => ({
                        ...prev,
                        pdfs: [...(prev.pdfs || []), { url, displayName: file.name.replace(/\.pdf$/i, '') }]
                      }));
                      setShowPdfUploadModal(false);
                    } catch (err) {
                      setError('Failed to upload PDF');
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00FFFF] file:text-black hover:file:bg-opacity-80"
                />
              </div>
              {uploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFFF] mr-3"></div>
                  <span>Uploading...</span>
                </div>
              )}
              <div className="text-sm text-gray-400 mb-4">
                <p>• Only PDF files are supported</p>
                <p>• Maximum file size: 10MB</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPdfUploadModal(false)}
                  className="px-4 py-2 bg-[#333333] text-white rounded hover:bg-[#444444] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <img
                src={selectedImage}
                alt="Full size image"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Video Selector Modal */}
        {showVideoSelector && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-[#181818] border border-[#333333] rounded-lg p-8 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowVideoSelector(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h2 className="text-xl font-bold mb-4">Select Video</h2>
              <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
                {mediaFiles.filter(f => f.match(/\.(mp4|webm|ogg)$/i)).length === 0 && (
                  <div className="text-gray-400">No video files found. Upload videos in .mp4, .webm, or .ogg format.</div>
                )}
                {mediaFiles.filter(f => f.match(/\.(mp4|webm|ogg)$/i)).map((file, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <video src={`/media/${file}`} className="w-32 h-20 object-cover rounded border border-[#333333]" controls />
                    <button
                      className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                      onClick={() => {
                        setForm(prev => ({ ...prev, videos: [...(prev.videos || []), `/media/${file}`] }));
                        setShowVideoSelector(false);
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Design Selector Modal */}
        {showDesignSelector && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-[#181818] border border-[#333333] rounded-lg p-8 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowDesignSelector(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h2 className="text-xl font-bold mb-4">Select Design Images</h2>
              <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {mediaFiles.filter(f => f.match(/\.(jpg|jpeg|png|gif|svg)$/i)).length === 0 && (
                  <div className="text-gray-400 col-span-2">No design images found. Upload images in .jpg, .png, .gif, or .svg format.</div>
                )}
                {mediaFiles
                  .filter(f => f.match(/\.(jpg|jpeg|png|gif|svg)$/i))
                  .slice() // copy array
                  .reverse() // newest first
                  .map((file, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img 
                        src={`/media/${file}`} 
                        className="w-24 h-24 object-cover rounded border border-[#333333] mb-2" 
                        alt={file} 
                        onError={e => { e.target.onerror = null; e.target.src = '/media/profile.jpg'; }}
                      />
                      <button
                        className="px-3 py-2 bg-[#00FFFF] text-black rounded hover:bg-opacity-80 text-sm"
                        onClick={() => {
                          setForm(prev => ({ ...prev, designs: [`/media/${file}`, ...(prev.designs || []).filter(d => d !== `/media/${file}`)] }));
                          setShowDesignSelector(false);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={handleAdd}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 z-40 flex items-center justify-center"
          title="Add New Project"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </div>
    </div>
  );
} 