"use client";
import React, { useState, useEffect } from "react";
import ClientLayout from '@/components/ClientLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaintbrush,
  faChartBar,
  faDisplay,
  faMobileScreenButton,
  faUserGear,
  faMagnifyingGlass,
  faEnvelope,
  faFilm,
  faCamera,
  faTag,
  faShareNodes,
  faFileLines
} from '@fortawesome/free-solid-svg-icons';

// Icon mapping for FontAwesome icons
const ICON_MAP = {
  'graphic-design': faPaintbrush,
  'marketing': faChartBar,
  'web': faDisplay,
  'app': faMobileScreenButton,
  'consulting': faUserGear,
  'seo': faMagnifyingGlass,
  'email': faEnvelope,
  'video': faFilm,
  'photography': faCamera,
  'branding': faTag,
  'social-media': faShareNodes,
  'content-creation': faFileLines,
};

// New icon maps for design and video tools
const DESIGN_TOOL_ICONS = {
  illustrator: { label: 'Illustrator', icon: <span className="text-white text-xl">Ai</span> },
  photoshop: { label: 'Photoshop', icon: <span className="text-white text-xl">Ps</span> },
  canva: { label: 'Canva', icon: <span className="text-white text-xl">Cv</span> },
  indesign: { label: 'InDesign', icon: <span className="text-white text-xl">Id</span> },
  figma: { label: 'Figma', icon: <span className="text-white text-xl">Fg</span> },
};
const VIDEO_TOOL_ICONS = {
  premiere: { label: 'Premiere', icon: <span style={{color:'#9999FF'}}>🅿️</span> },
  aftereffects: { label: 'After Effects', icon: <span style={{color:'#9999FF'}}>🄰</span> },
  finalcut: { label: 'Final Cut', icon: <span style={{color:'#FF5F57'}}>🄵</span> },
  davinci: { label: 'DaVinci', icon: <span style={{color:'#222'}}>🄳</span> },
};

function MainComponent() {
  const [activeFilter, setActiveFilter] = useState("major-projects");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewedPdf, setViewedPdf] = useState(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch projects and categories from the database
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "getAll" }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Map old 'website' category to 'major-projects'
          setProjects(data.projects.map(p => p.category === 'website' ? { ...p, category: 'major-projects' } : p));
        } else {
          setError(data.message || "Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getAll" }),
        });
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else if (Array.isArray(data)) {
          // fallback for GET
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const filteredProjects =
    activeFilter === "major-projects"
      ? projects.filter((project) => project.category === "major-projects")
      : projects.filter((project) => project.category === activeFilter);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#121212] text-white font-poppins">
        {/* Portfolio Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                My Portfolio
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
              Explore my latest projects spanning app development, websites, AI
              art generation, and interactive video experiences.
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setActiveFilter("major-projects")}
                className={`px-6 py-2 rounded-full border ${
                  activeFilter === "major-projects"
                    ? "bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black border-transparent"
                    : "border-[#333333] hover:border-[#00FFFF] transition-colors"
                }`}
              >
                Major Projects
              </button>
              {categories.length === 0 && (
                <span className="text-gray-400">No categories found</span>
              )}
              {categories.filter(category => category.id !== 'major-projects').map((category, idx) => (
                <button
                  key={category.id || idx}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-6 py-2 rounded-full border ${
                    activeFilter === category.id
                      ? "bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black border-transparent"
                      : "border-[#333333] hover:border-[#00FFFF] transition-colors"
                  }`}
                >
                  {category.name || category.id || 'Unnamed'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-xl text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#333333] rounded-md hover:bg-[#444444] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#333333] hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => openProjectModal(project)}
                  >
                    {project.category === 'designs' ? (
                      <div className="relative h-56 overflow-hidden flex flex-col justify-end">
                        {/* Collage of up to 6 images */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1">
                          {(project.additional_images || []).slice(0, 6).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Design ${idx + 1}`}
                              className="object-cover w-full h-full rounded-sm"
                              style={{ gridRow: Math.floor(idx / 2) + 1, gridColumn: (idx % 2) + 1 }}
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        {/* Centered title and tool icons overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <h3 className="text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg" style={{ fontSize: '6em', lineHeight: 1, marginBottom: '0.2em' }}>
                            {project.title}
                          </h3>
                          {Array.isArray(project.icons) && project.icons.length > 0 && (
                            <div className="flex gap-2 mt-1">
                              {project.icons.filter(icon => DESIGN_TOOL_ICONS[icon]).map(icon => (
                                <span key={icon} title={DESIGN_TOOL_ICONS[icon].label} className="text-2xl animate-pulse">
                                  {DESIGN_TOOL_ICONS[icon].icon}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : project.category === 'video' ? (
                      <div className="relative h-56 overflow-hidden flex flex-col justify-end bg-black">
                        {/* Grid of up to 6 video thumbnails */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1">
                          {(project.videos || []).slice(0, 6).map((vid, idx) => (
                            <video
                              key={idx}
                              src={vid}
                              className="object-cover w-full h-full rounded-sm bg-black"
                              style={{ gridRow: Math.floor(idx / 2) + 1, gridColumn: (idx % 2) + 1 }}
                              muted
                              autoPlay
                              loop
                              playsInline
                              preload="metadata"
                              poster=""
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/60"></div>
                        </div>
                        {/* Centered title overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <h3 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg">
                            {project.title}
                          </h3>
                          <p className="text-gray-300 text-lg text-center max-w-xl px-4 mt-2 drop-shadow-lg">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    ) : project.category === 'app' ? (
                      <div className="relative h-56 overflow-hidden flex flex-col justify-end">
                        {/* Creative Thumbnail for Apps (no favicon) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#23272a] via-[#18191a] to-[#111112] flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center w-full h-full z-10">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ) : project.category === 'websites' ? (
                      <div className="relative h-56 overflow-hidden flex flex-col justify-end">
                        {/* Creative Thumbnail for Website Libraries */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#23272a] via-[#18191a] to-[#111112] flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center w-full h-full z-10">
                            <img
                              src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(project.pages && project.pages[0]?.url || project.project_link || '')}`}
                              alt="Favicon"
                              className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 bg-[#181818]"
                              onError={e => { e.target.onerror = null; e.target.src = '/media/profile.jpg'; }}
                            />
                            <h3 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ) : project.category === 'github' ? (
                      <div className="relative h-56 overflow-hidden flex flex-col justify-end">
                        {/* Creative Thumbnail for GitHub (like designs, no icons) */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1">
                          {(project.additional_images || []).slice(0, 6).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`GitHub ${idx + 1}`}
                              className="object-cover w-full h-full rounded-sm"
                              style={{ gridRow: Math.floor(idx / 2) + 1, gridColumn: (idx % 2) + 1 }}
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        {/* Centered title overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <h3 className="text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg" style={{ fontSize: '6em', lineHeight: 1, marginBottom: '0.2em' }}>
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={project.image_url || "/placeholder-project.jpg"}
                          alt={`${project.title} project thumbnail`}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                        />
                        {/* Remove icon display for normal/major projects */}
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 text-xs font-semibold bg-[#121212]/80 backdrop-blur-sm rounded-full">
                            {project.category === "app" && "App Development"}
                            {project.category === "major-projects" && "Major Projects"}
                            {project.category === "designs" && "Designs"}
                            {project.category === "video" && "Video"}
                            {project.category === "github" && "GitHub"}
                            {!['app', 'major-projects', 'designs', 'video', 'websites', 'github'].includes(project.category) && project.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {project.category !== 'designs' && project.category !== 'websites' && project.category !== 'app' && project.category !== 'github' && (
                        <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                      )}
                      {project.category !== 'websites' && project.category !== 'app' && project.category !== 'github' && (
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.category !== 'websites' && project.category !== 'app' && project.category !== 'github' && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags &&
                            project.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 text-sm bg-[#121212] rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                      {project.category !== 'websites' && project.category !== 'app' && project.category !== 'github' && project.additional_images && project.additional_images.length > 0 && (
                        <div className="flex items-center text-xs text-gray-400">
                          <i className="fa-solid fa-images mr-1"></i>
                          {project.additional_images.length} more image{project.additional_images.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      {/* Project Image for other categories that still need full screen click */}
                      {(!['designs', 'video', 'app', 'websites', 'github'].includes(project.category) && project.image_url) && (
                        <img
                          src={project.image_url}
                          alt={`${project.title} project image`}
                          className="w-full h-48 object-cover rounded-lg mt-4 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                          onClick={() => setSelectedImage(project.image_url)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Modal */}
        {isModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
            <div className="relative bg-[#1A1A1A] max-w-6xl w-full rounded-lg max-h-[95vh] overflow-hidden flex">
              {/* Sidebar Navigation - hide for designs/videos and for normal projects, replaced with mobile-like icon sidebar */}
              {/* Main Content - always full width for normal projects now */}
              <div className="flex-1 overflow-y-auto relative">
                <button
                  onClick={closeProjectModal}
                  className="absolute top-4 right-4 bg-white text-black text-4xl font-extrabold rounded-full shadow-lg border-4 border-[#00FFFF] p-3 z-50 hover:bg-[#00FFFF] hover:text-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00FFFF]"
                  aria-label="Close project modal"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Mobile-like floating icon sidebar for normal projects only */}
                {!["designs", "videos", "github", "websites", "app"].includes(selectedProject.category) && (
                  <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 bg-[#181818]/90 rounded-full px-3 py-6 shadow-lg border border-[#333333] md:hidden">
                    <a href="#overview" className="flex flex-col items-center text-gray-300 hover:text-[#00FFFF] transition-colors">
                      <i className="fa-solid fa-list-alt text-xl mb-1"></i>
                      <span className="text-xs">Overview</span>
                    </a>
                    <a href="#details" className="flex flex-col items-center text-gray-300 hover:text-[#00FFFF] transition-colors">
                      <i className="fa-solid fa-cogs text-xl mb-1"></i>
                      <span className="text-xs">Details</span>
                    </a>
                    <a href="#gallery" className="flex flex-col items-center text-gray-300 hover:text-[#00FFFF] transition-colors">
                      <i className="fa-solid fa-images text-xl mb-1"></i>
                      <span className="text-xs">Gallery</span>
                    </a>
                    <a href="#documents" className="flex flex-col items-center text-gray-300 hover:text-[#00FFFF] transition-colors">
                      <i className="fa-solid fa-file-pdf text-xl mb-1"></i>
                      <span className="text-xs">Docs</span>
                    </a>
                  </div>
                )}

                {/* Combined Featured Image for designs/videos */}
                {selectedProject.category === 'designs' ? (
                  <div className="w-full flex flex-col items-center justify-center pt-8">
                    {/* Tool Icons Row */}
                    {Array.isArray(selectedProject.icons) && selectedProject.icons.length > 0 && (
                      <div className="flex gap-4 mb-4">
                        {selectedProject.icons.filter(icon => DESIGN_TOOL_ICONS[icon]).map(icon => (
                          <span key={icon} title={DESIGN_TOOL_ICONS[icon].label} className="text-3xl animate-pulse">{DESIGN_TOOL_ICONS[icon].icon}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg">{selectedProject.title}</h2>
                    <p className="text-gray-300 mb-6 text-center max-w-2xl">{selectedProject.description}</p>
                    {/* Additional Images (Designs) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {(selectedProject.additional_images || []).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Design ${idx + 1}`}
                          className="w-full h-auto rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                    </div>
                  </div>
                ) : selectedProject.category === 'video' ? (
                  <div className="w-full flex flex-col items-center justify-center pt-8">
                    {/* Gradient Thumbnail for Video Projects */}
                    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gradient-to-br from-[#00FFFF] via-[#FF00FF] to-[#00FFFF] mb-6">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl text-center">
                          {selectedProject.title}
                        </h2>
                      </div>
                    </div>
                    <VideoGalleryModal videos={selectedProject.videos || []} onClose={closeProjectModal} />
                  </div>
                ) : selectedProject.category === 'app' ? (
                  <div className="w-full flex flex-col items-center justify-center pt-8">
                    {/* App Expanded View (identical to Website Library, no favicon, no extra details) */}
                    <div className="flex flex-col items-center w-full">
                      {/* Creative Thumbnail */}
                      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gradient-to-br from-[#23272a] via-[#18191a] to-[#111112] mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="flex flex-col items-center justify-center w-full h-full z-10">
                          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">
                            {selectedProject.title}
                          </h2>
                        </div>
                      </div>
                      {/* Live Preview */}
                      <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden border-2 border-[#333333] bg-black">
                        <iframe
                          src={selectedProject.project_link}
                          title={selectedProject.title}
                          className="w-full h-full min-h-[400px] bg-black"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ) : selectedProject.category === 'websites' ? (
                  <div className="w-full flex flex-col items-center justify-center pt-8">
                    {/* Website Library Expanded View */}
                    <div className="flex flex-col items-center w-full">
                      {/* Creative Thumbnail */}
                      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gradient-to-br from-[#00FFFF] via-[#FF00FF] to-[#00FFFF] mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="flex flex-col items-center justify-center w-full h-full z-10">
                          <img
                            src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(selectedProject.project_link)}`}
                            alt="Favicon"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4 bg-[#181818]"
                            onError={e => { e.target.onerror = null; e.target.src = '/media/profile.jpg'; }}
                          />
                          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">
                            {selectedProject.title}
                          </h2>
                        </div>
                      </div>
                      {/* Live Preview */}
                      <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden border-2 border-[#333333] bg-black">
                        <iframe
                          src={selectedProject.project_link}
                          title={selectedProject.title}
                          className="w-full h-full min-h-[400px] bg-black"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ) : selectedProject.category === 'github' ? (
                  <div className="w-full flex flex-col items-center justify-center pt-8">
                    {/* GitHub Expanded View (like designs, no icons, with GitHub project overview) */}
                    <div className="flex flex-col items-center w-full">
                      {/* Creative Thumbnail */}
                      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1">
                          {(selectedProject.additional_images || []).slice(0, 6).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`GitHub ${idx + 1}`}
                              className="object-cover w-full h-full rounded-sm"
                              style={{ gridRow: Math.floor(idx / 2) + 1, gridColumn: (idx % 2) + 1 }}
                            />
                          ))}
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent drop-shadow-lg">
                            {selectedProject.title}
                          </h2>
                        </div>
                      </div>
                      {/* GitHub Project Overview */}
                      <div className="w-full max-w-2xl bg-[#18191a] rounded-lg p-8 border border-[#333333] mb-6">
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                          <i className="fa-brands fa-github text-2xl"></i> {selectedProject.title}
                        </h3>
                        <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                        {/* GitHub Stats Section (example fields, adjust as needed) */}
                        {selectedProject.github_stats && (
                          <div className="flex flex-wrap gap-6 mb-2">
                            {selectedProject.github_stats.languages && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1 text-[#00FFFF]">Languages</h4>
                                <ul>
                                  {Object.entries(selectedProject.github_stats.languages).map(([lang, percent]) => (
                                    <li key={lang} className="text-gray-400 text-sm">{lang}: {percent}%</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedProject.github_stats.stars !== undefined && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1 text-[#00FFFF]">Stars</h4>
                                <span className="text-gray-400 text-sm">{selectedProject.github_stats.stars}</span>
                              </div>
                            )}
                            {selectedProject.github_stats.forks !== undefined && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1 text-[#00FFFF]">Forks</h4>
                                <span className="text-gray-400 text-sm">{selectedProject.github_stats.forks}</span>
                              </div>
                            )}
                            {selectedProject.github_stats.issues !== undefined && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1 text-[#00FFFF]">Open Issues</h4>
                                <span className="text-gray-400 text-sm">{selectedProject.github_stats.issues}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {selectedProject.project_link && (
                          <a
                            href={selectedProject.project_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                          >
                            View on GitHub <i className="fa-brands fa-github ml-2"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={selectedProject.image_url || "/placeholder-project.jpg"}
                      alt={`${selectedProject.title} project showcase`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-70"></div>
                    {selectedProject.additional_images && selectedProject.additional_images.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-[#FF00FF]/80 backdrop-blur-sm rounded-full flex items-center">
                          <i className="fa-solid fa-images mr-1"></i>
                          +{selectedProject.additional_images.length}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="px-3 py-1 text-xs font-semibold bg-[#121212]/80 backdrop-blur-sm rounded-full mb-3 inline-block">
                        {selectedProject.category === "app" && "App Development"}
                        {selectedProject.category === "major-projects" && "Major Projects"}
                        {selectedProject.category === "designs" && "Designs"}
                        {selectedProject.category === "video" && "Video"}
                        {selectedProject.category === "github" && "GitHub"}
                        {!['app', 'major-projects', 'designs', 'video', 'websites', 'github'].includes(selectedProject.category) && selectedProject.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {selectedProject.title}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Only show description and gallery for designs/videos. Hide for website libraries. */}
                  {selectedProject.category === 'designs' ? (
                    <>
                      {/* Gallery */}
                      {(selectedProject.additional_images && selectedProject.additional_images.length > 0) && (
                        <div id="gallery" className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Image Gallery</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedProject.additional_images.map((image, index) => (
                              <div key={index} className="relative group aspect-square">
                                <img
                                  src={image}
                                  alt={`${selectedProject.title} - Image ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                  onClick={() => setSelectedImage(image)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                  <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : selectedProject.category === 'video' ? (
                    <>
                      {/* No content for video projects - only video player shown above */}
                    </>
                  ) : (selectedProject.category === 'websites' || selectedProject.category === 'app' || selectedProject.category === 'github') ? null : (
                    <>
                      {/* Overview Section */}
                      <div id="overview" className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Overview</h3>
                        <p className="text-gray-300 mb-4">
                          {selectedProject.full_description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div>
                            <h3 className="text-[#00FFFF] font-semibold mb-2">Client</h3>
                            <p className="text-gray-300">{selectedProject.client}</p>
                          </div>
                          <div>
                            <h3 className="text-[#00FFFF] font-semibold mb-2">Duration</h3>
                            <p className="text-gray-300">{selectedProject.duration}</p>
                          </div>
                          <div>
                            <h3 className="text-[#00FFFF] font-semibold mb-2">Project Link</h3>
                            {selectedProject.project_link ? (
                              <a
                                href={selectedProject.project_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00FFFF] hover:underline"
                              >
                                View Live{" "}
                                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i>
                              </a>
                            ) : (
                              <p className="text-gray-400">Not available</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Details Section */}
                      <div id="details" className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {selectedProject.technologies &&
                            selectedProject.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#121212] rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h3 className="text-xl font-bold mb-4">The Challenge</h3>
                            <p className="text-gray-300">{selectedProject.challenge}</p>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-4">The Solution</h3>
                            <p className="text-gray-300">{selectedProject.solution}</p>
                          </div>
                        </div>
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Results</h3>
                          <p className="text-gray-300">{selectedProject.results}</p>
                        </div>
                      </div>
                      {/* Enhanced Image Gallery */}
                      {(selectedProject.additional_images && selectedProject.additional_images.length > 0) && (
                        <div id="gallery" className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Image Gallery</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedProject.additional_images.map((image, index) => (
                              <div key={index} className="relative group aspect-square">
                                <img
                                  src={image}
                                  alt={`${selectedProject.title} - Image ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                  onClick={() => setSelectedImage(image)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                  <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}



                  {/* Project Designs Section */}
                  {selectedProject.designs && selectedProject.designs.length > 0 && (
                    <div id="designs" className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Designs / Graphics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedProject.designs.map((design, idx) => (
                          <div key={idx} className="relative group aspect-square">
                            <img
                              src={design}
                              alt={`Design ${idx + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-[#333333] transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                              onClick={() => setSelectedImage(design)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                              <i className="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced PDF Documents Section */}
                  {selectedProject.pdfs && selectedProject.pdfs.length > 0 && (
                    <div id="documents" className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Project Documents</h3>
                      <div className="space-y-4">
                        {selectedProject.pdfs.map((pdf, idx) => (
                          <div key={idx} className="bg-[#222222] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <button
                                  className={`px-4 py-2 rounded bg-[#333] text-[#00FFFF] font-semibold hover:bg-[#444] transition-colors ${viewedPdf === pdf.url ? 'ring-2 ring-[#00FFFF]' : ''}`}
                                  onClick={() => {
                                    setViewedPdf(pdf.url);
                                    setCurrentPdfPage(1);
                                  }}
                                >
                                  <i className="fa-solid fa-file-pdf mr-2"></i>
                                  {pdf.displayName || pdf.url.split('/').pop()}
                                </button>
                                <a href={encodeURI(pdf.url)} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 underline hover:text-[#00FFFF]">
                                  Open in new tab
                                </a>
                              </div>
                            </div>
                            
                            {viewedPdf === pdf.url && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setCurrentPdfPage(Math.max(1, currentPdfPage - 1))}
                                      className="px-3 py-1 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
                                      disabled={currentPdfPage <= 1}
                                    >
                                      <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <span className="text-sm text-gray-300">
                                      Page {currentPdfPage}
                                    </span>
                                    <button
                                      onClick={() => setCurrentPdfPage(currentPdfPage + 1)}
                                      className="px-3 py-1 bg-[#333] text-white rounded hover:bg-[#444] transition-colors"
                                    >
                                      <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="w-full h-[60vh] bg-black rounded-lg overflow-hidden border border-[#333333] relative">
                                  <PDFWithFallback url={`${encodeURI(pdf.url)}#page=${currentPdfPage}`} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.project_link && (
                    <div className="flex justify-center mt-8">
                      <a
                        href={selectedProject.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity"
                      >
                        Visit Project{" "}
                        <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-black text-4xl font-extrabold rounded-full shadow-lg border-4 border-[#00FFFF] p-3 z-50 hover:bg-[#00FFFF] hover:text-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00FFFF]"
                aria-label="Close full screen image"
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

        {/* Contact CTA */}
        <section className="py-20 px-4 bg-[#1A1A1A]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Interested in working together?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your vision.
            </p>
            <a
              href="/home#contact"
              className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity inline-block"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-[#333333]">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent mb-2">
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

function PDFWithFallback({ url }) {
  const [error, setError] = React.useState(false);
  return error ? (
    <div className="flex items-center justify-center h-full text-red-400 text-lg p-8 text-center">
      This document could not be found. Please contact the site owner if you need access.
    </div>
  ) : (
    <iframe
      src={url}
      title="PDF Viewer"
      className="w-full h-full"
      frameBorder="0"
      onError={() => setError(true)}
    ></iframe>
  );
}

function VideoGalleryModal({ videos, onClose }) {
  const [current, setCurrent] = React.useState(0);
  if (!videos || videos.length === 0) return null;

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to check if video is YouTube
  const isYouTubeVideo = (video) => {
    return video.includes('youtube.com') || video.includes('youtu.be');
  };

  const currentVideo = videos[current];
  const isYouTube = isYouTubeVideo(currentVideo);
  const youtubeId = isYouTube ? getYouTubeVideoId(currentVideo) : null;

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 bg-black">
      <div className="relative w-full max-w-3xl mx-auto">
        {isYouTube ? (
          <iframe
            key={current}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title="YouTube video player"
            className="w-full rounded-lg border border-[#333333] aspect-video bg-black"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={current}
            src={currentVideo}
            controls
            autoPlay
            className="w-full rounded-lg border border-[#333333] aspect-video bg-black"
          />
        )}
        {videos.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((current - 1 + videos.length) % videos.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#121212]/80 text-white rounded-full p-4 hover:bg-[#00FFFF] transition-colors z-10"
              aria-label="Previous video"
            >
              <i className="fa-solid fa-chevron-left text-3xl"></i>
            </button>
            <button
              onClick={() => setCurrent((current + 1) % videos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#121212]/80 text-white rounded-full p-4 hover:bg-[#00FFFF] transition-colors z-10"
              aria-label="Next video"
            >
              <i className="fa-solid fa-chevron-right text-3xl"></i>
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black text-2xl font-extrabold rounded-full shadow-lg border-4 border-[#00FFFF] p-3 z-20 hover:bg-[#00FFFF] hover:text-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00FFFF]"
          aria-label="Close video modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default MainComponent;