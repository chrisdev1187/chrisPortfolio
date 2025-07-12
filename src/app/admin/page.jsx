"use client";
import React, { useState, useEffect, useRef } from "react";

function MainComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalServices: 0,
    totalMessages: 0,
    recentVisits: 0,
  });

  // Add handleChange for About Me and Contact sections
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If About Me section is active and user state exists
    if (activeSection === "about" && user) {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
    // If Contact section is active and contact state exists
    if (activeSection === "contact" && contact) {
      setContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkAuth" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user);
          setLoading(false);
          setAuthChecked(true);
        } else {
          setLoading(false);
          setAuthChecked(true);
        }
      });
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "logout" }),
      });

      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-poppins flex">
      <div className="w-64 bg-[#1A1A1A] border-r border-[#333333] fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-[#333333]">
          <a
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text"
          >
            CB Admin
          </a>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="text-gray-400 text-sm mb-2">Logged in as:</div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] flex items-center justify-center text-black font-bold mr-2">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{user?.email}</div>
                <div className="text-xs text-gray-400">Administrator</div>
              </div>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "dashboard"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-gauge-high mr-3"></i>
                  <span className="font-bold text-white">Dashboard</span>
                </button>
              </li>
              <li>
                <a
                  href="/admin/projects"
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "projects"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-briefcase mr-3"></i>
                  <span className="font-bold text-white">Projects</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/services"
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "services"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-server mr-3"></i>
                  <span className="font-bold text-white">Services</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/media"
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "media"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-images mr-3"></i>
                  <span className="font-bold text-white">Media</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("categories")}
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "categories"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-tags mr-3"></i>
                  <span className="font-bold text-white">Project Categories</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("homepage")}
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "homepage"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-house mr-3"></i>
                  <span className="font-bold text-white">Homepage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("about")}
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "about"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-user mr-3"></i>
                  <span className="font-bold text-white">About</span>
                </button>
              </li>
              <li>
                <a
                  href="/admin/testimonials"
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "testimonials"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-quote-left mr-3"></i>
                  <span className="font-bold text-white">Testimonials</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("messages")}
                  className={`w-full font-bold text-left px-4 py-2 rounded-md flex items-center ${
                    activeSection === "messages"
                      ? "bg-[#333333]"
                      : "hover:bg-[#222222]"
                  }`}
                >
                  <i className="fa-solid fa-comments mr-3"></i>
                  <span className="font-bold text-white">Messages</span>
                  {messages.filter(m => !m.read).length > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {messages.filter(m => !m.read).length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-[#333333]">
          <button
            onClick={handleLogout}
            className="w-full font-bold px-4 py-2 text-left text-gray-400 hover:text-white flex items-center"
          >
            <i className="fa-solid fa-right-from-bracket mr-3"></i>
            <span className="font-bold text-white">Logout</span>
          </button>
        </div>
      </div>

      <div className="ml-64 flex-1 p-8">
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Dashboard
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Projects</h3>
                  <i className="fa-solid fa-briefcase text-[#00FFFF]"></i>
                  </div>
                <div className="text-3xl font-bold">{projects.length}</div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Services</h3>
                  <i className="fa-solid fa-server text-[#FF00FF]"></i>
                  </div>
                <div className="text-3xl font-bold">{services.length}</div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Messages</h3>
                  <i className="fa-solid fa-comments text-[#00FFFF]"></i>
                  </div>
                <div className="text-3xl font-bold">{messages.length}</div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Recent Visits</h3>
                  <i className="fa-solid fa-chart-line text-[#FF00FF]"></i>
                </div>
                <div className="text-3xl font-bold">{stats.recentVisits}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Recent Project Requests</h3>
                <div className="space-y-4">
                  {messages.filter(m => m.type === 'Project Request').slice(-5).reverse().map(msg => (
                    <div key={msg.id} className="p-3 bg-[#121212] rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{msg.name}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
                      <p className="text-sm text-gray-300 truncate">{msg.message}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Recent General Messages</h3>
              <div className="space-y-4">
                  {messages.filter(m => m.type !== 'Project Request').slice(-5).reverse().map(msg => (
                    <div key={msg.id} className="p-3 bg-[#121212] rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{msg.name}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{msg.message}</p>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "messages" && (
          <MessagesManager messages={messages} setMessages={setMessages} currentUser={user} />
        )}

        {activeSection === "categories" && (
          <CategoriesManager categories={categories} setCategories={setCategories} />
        )}

        {activeSection === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  Projects
                </span>
              </h1>
              <button className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity">
                <i className="fa-solid fa-plus mr-2"></i>Add New Project
              </button>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="relative mb-4 md:mb-0 md:w-64">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                  />
                  <i className="fa-solid fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>

                <div className="flex space-x-4">
                  <select className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]">
                    <option value="">All Categories</option>
                    <option value="web">Web Development</option>
                    <option value="ai">AI/ML</option>
                    <option value="vr">VR/AR</option>
                  </select>

                  <select className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]">
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded bg-[#222222] border-[#333333]"
                        />
                      </th>
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...projects,
                      {
                        id: 4,
                        title: "Data Visualization Dashboard",
                        category: "Web Development",
                        status: "Published",
                        date: "2025-02-15",
                      },
                      {
                        id: 5,
                        title: "Neural Network Art Generator",
                        category: "AI/ML",
                        status: "Draft",
                        date: "2025-01-20",
                      },
                      {
                        id: 6,
                        title: "Interactive Sound Installation",
                        category: "Installation",
                        status: "Published",
                        date: "2024-12-10",
                      },
                      {
                        id: 7,
                        title: "Augmented Reality App",
                        category: "VR/AR",
                        status: "Draft",
                        date: "2024-11-05",
                      },
                    ].map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-[#333333] hover:bg-[#222222]"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="rounded bg-[#222222] border-[#333333]"
                          />
                        </td>
                        <td className="py-3 px-4">{project.title}</td>
                        <td className="py-3 px-4">{project.category}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project.status === "Published"
                                ? "bg-green-900/30 text-green-400"
                                : "bg-yellow-900/30 text-yellow-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {project.date || "2025-03-01"}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-gray-400 hover:text-[#00FFFF] mr-3">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button className="text-gray-400 hover:text-[#00FFFF] mr-3">
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button className="text-gray-400 hover:text-[#FF00FF]">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === "services" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  Services
                </span>
              </h1>
              <button className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity">
                <i className="fa-solid fa-plus mr-2"></i>Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ...services,
                {
                  id: 3,
                  title: "Digital Art & Installations",
                  description: "Creating immersive digital art experiences",
                },
                {
                  id: 4,
                  title: "Creative Technology Consulting",
                  description:
                    "Strategic advice on creative technology implementation",
                },
                {
                  id: 5,
                  title: "Frontend Development",
                  description:
                    "Building responsive and interactive user interfaces",
                },
              ].map((service) => (
                <div
                  key={service.id}
                  className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-[#00FFFF]">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="text-gray-400 hover:text-[#FF00FF]">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      ID: {service.id}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-400">Active</span>
                      <div className="relative inline-block w-10 h-5 rounded-full bg-[#333333]">
                        <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-[#00FFFF]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "media" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                  Media Library
                </span>
              </h1>
              <button className="px-4 py-2 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity">
                <i className="fa-solid fa-upload mr-2"></i>Upload Media
              </button>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="relative mb-4 md:mb-0 md:w-64">
                  <input
                    type="text"
                    placeholder="Search media..."
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]"
                  />
                  <i className="fa-solid fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>

                <div className="flex space-x-4">
                  <select className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 focus:outline-none focus:border-[#00FFFF]">
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="document">Documents</option>
                  </select>

                  <button className="px-4 py-2 border border-[#333333] rounded-md hover:border-[#00FFFF] transition-colors">
                    <i className="fa-solid fa-filter mr-2"></i>Filters
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="group relative border border-[#333333] rounded-lg overflow-hidden"
                  >
                    <img
                      src={`/project${item}.jpg`}
                      alt={`Media item ${item}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-3">
                        <button className="w-8 h-8 rounded-full bg-[#00FFFF] text-black flex items-center justify-center">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#FF00FF] text-black flex items-center justify-center">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="p-2 bg-[#222222]">
                      <div className="text-sm truncate">
                        project-image-{item}.jpg
                      </div>
                      <div className="text-xs text-gray-400">
                        800 × 600 • 245 KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "homepage" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Homepage Management
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact & Social */}
            </div>
          </div>
        )}

        {activeSection === "about" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                About Me
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* About Me Content */}
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">About Me</h2>
                <p className="text-gray-300 mb-4">
                  Write a brief introduction about yourself here.
                </p>
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Profile Picture</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={user?.profilePicture || "/profile.jpg"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border border-[#333333]"
                      onError={(e) => {
                        // Fallback to media directory if root file doesn't exist
                        if (e.target.src.includes('/profile.jpg')) {
                          e.target.src = '/media/profile.jpg';
                        }
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handlePhotoUpload(file);
                      }}
                      className="text-sm text-gray-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <input
                    type="text"
                    name="title"
                    placeholder="Professional Title"
                    value={user?.title}
                    onChange={handleChange}
                    className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    name="subtitle"
                    placeholder="Subtitle"
                    value={user?.subtitle}
                    onChange={handleChange}
                    className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={user?.location}
                    onChange={handleChange}
                    className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user?.email}
                    onChange={handleChange}
                    className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    name="bio"
                    placeholder="Bio"
                    value={user?.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4"
                  />
                  <textarea
                    name="experience"
                    placeholder="Experience Summary"
                    value={user?.experience}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white mb-4"
                  />
                  <textarea
                    name="education"
                    placeholder="Education"
                    value={user?.education}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Interactive Development, AI Integration, Immersive Experiences"
                    value={user?.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                  />
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="url"
                      name="github"
                      placeholder="GitHub URL"
                      value={user?.socialLinks.github}
                      onChange={handleSocialChange}
                      className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="LinkedIn URL"
                      value={user?.socialLinks.linkedin}
                      onChange={handleSocialChange}
                      className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                    />
                    <input
                      type="url"
                      name="twitter"
                      placeholder="Twitter URL"
                      value={user?.socialLinks.twitter}
                      onChange={handleSocialChange}
                      className="bg-[#222222] border border-[#333333] rounded-md px-4 py-2 text-white"
                    />
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
          </div>
        )}

        {activeSection === "testimonials" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Testimonials
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Testimonial Cards */}
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{t.name}</h3>
                    <div className="w-10 h-10 rounded-full bg-[#00FFFF]/10 flex items-center justify-center text-[#00FFFF]">
                      <i className="fa-solid fa-quote-left"></i>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{t.text}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {t.date}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-[#00FFFF] mr-3">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="text-gray-400 hover:text-[#FF00FF]">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={SARAH_IMG}
                alt="New Testimonial"
                className="w-24 h-24 rounded-full object-cover border border-[#333333]"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-1 text-white mb-2 w-full"
                  placeholder="Client Name"
                />
                <textarea
                  value={newTestimonial.text}
                  onChange={e => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  className="bg-[#1A1A1A] border border-[#333333] rounded-md px-3 py-1 text-white w-full"
                  rows={2}
                  placeholder="Testimonial Text"
                />
              </div>
              <button
                onClick={handleAdd}
                className="text-[#00FFFF] hover:text-green-400 ml-2"
                title="Add"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
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
        )}

        {activeSection === "contact" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                Contact & Social Media
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Contact Form</h2>
                <div className="text-gray-400 mb-2">Configure the contact form settings.</div>
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
          </div>
        )}

        {activeSection === "portfolio" && (
          <PortfolioManager />
        )}
      </div>
    </div>
  );
}

// The following components were previously in this file but have been moved or refactored:
// AboutMeEditor (now handles photo uploads without IconPicker)
// ContactSocialEditor
// FeaturedProjectsEditor
// MessagesManager
// PortfolioManager (now handles image uploads without IconPicker)
// ServicesManager
// StatsEditor
// TestimonialsEditor
// CategoriesManager

// No IconPicker related functions or components should be present here.

export default function AdminPage() {
  return <MainComponent />;
}