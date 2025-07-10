import { NextResponse } from 'next/server';
import fs from 'fs';

async function fetchWebsiteMeta(url) {
  // For demonstration, mock the fetch with static URLs and structure
  // In production, use real APIs like Clearbit, Google, or Puppeteer for screenshots
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  return {
    favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
    logo: `https://logo.clearbit.com/${domain}`,
    screenshot: `https://image.thum.io/get/width/800/crop/600/noanimate/${url}`,
    themeColor: '#222',
    pages: [url],
  };
}

async function handler({
  action,
  projectId,
  projectData,
  category,
  slug,
  featured,
  projects,
}) {
  // Mock data for development if sql is not defined
  const mockProjects = [
    {
      id: 1,
      title: "Neural Canvas",
      category: "ai-art",
      description: "An interactive installation that uses machine learning to transform visitor movements into digital art in real-time.",
      full_description: "A full description of Neural Canvas.",
      image_url: "/project1.jpg",
      client: "Art Gallery",
      duration: "3 months",
      technologies: ["React", "TensorFlow.js", "WebGL"],
      tags: ["AI", "Art", "Installation"],
      challenge: "Create real-time art from movement.",
      solution: "Used pose detection and generative art.",
      results: "High visitor engagement.",
      project_link: "https://neuralcanvas.example.com",
      featured: true,
      display_order: 1
    },
    {
      id: 2,
      title: "Eco Tracker",
      category: "app",
      description: "A sustainability app that helps users monitor and reduce their carbon footprint.",
      full_description: "A full description of Eco Tracker.",
      image_url: "/project2.jpg",
      client: "GreenTech",
      duration: "6 months",
      technologies: ["React Native", "Node.js"],
      tags: ["App", "Sustainability"],
      challenge: "Track and visualize carbon footprint.",
      solution: "Built a mobile app with real-time analytics.",
      results: "Users reduced emissions by 20%.",
      project_link: "https://ecotracker.example.com",
      featured: false,
      display_order: 2
    },
    {
      id: 3,
      title: "Immersive Storytelling",
      category: "video",
      description: "A WebXR narrative experience that blends interactive storytelling with immersive 3D environments.",
      full_description: "A full description of Immersive Storytelling.",
      image_url: "/project3.jpg",
      client: "Media Studio",
      duration: "4 months",
      technologies: ["Three.js", "WebXR", "React"],
      tags: ["WebXR", "Storytelling"],
      challenge: "Blend story and 3D immersion.",
      solution: "Used WebXR and interactive scripts.",
      results: "Award-winning experience.",
      project_link: "https://immersivestory.example.com",
      featured: true,
      display_order: 3
    },
    // New Website Project
    {
      id: 4,
      title: "Portfolio Website",
      category: "website",
      description: "A personal portfolio website to showcase projects and skills.",
      full_description: "A full description of the Portfolio Website.",
      image_url: "/project4.jpg",
      client: "Self",
      duration: "2 weeks",
      technologies: ["Next.js", "TailwindCSS", "Vercel"],
      tags: ["Website", "Portfolio"],
      challenge: "Showcase work in a modern, responsive way.",
      solution: "Built with Next.js and TailwindCSS.",
      results: "Increased client inquiries.",
      project_link: "https://portfolio.example.com",
      featured: false,
      display_order: 4
    },
    // New GitHub Project
    {
      id: 5,
      title: "Open Source CLI Tool",
      category: "github",
      description: "A command-line tool published on GitHub for developer productivity.",
      full_description: "A full description of the CLI tool.",
      image_url: "/project5.jpg",
      client: "Open Source",
      duration: "1 month",
      technologies: ["Node.js", "Commander.js"],
      tags: ["CLI", "Open Source", "GitHub"],
      challenge: "Make repetitive tasks easier for devs.",
      solution: "Created a flexible CLI with plugins.",
      results: "100+ GitHub stars.",
      project_link: "https://github.com/username/cli-tool",
      featured: false,
      display_order: 5
    }
  ];
  try {
    // Get all projects
    if (action === "getAll") {
      try {
        const projectsPath = 'src/data/projects.json';
        const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        return { success: true, projects };
      } catch (err) {
        // Fallback to mock data if file doesn't exist
        return { success: true, projects: mockProjects };
      }
    }

    // Get featured projects
    if (action === "getFeatured") {
      const projects = await sql`
        SELECT p.*, m.file_url as image_url 
        FROM projects p
        LEFT JOIN media m ON p.image_id = m.id
        WHERE p.featured = true
        ORDER BY p.display_order ASC, p.created_at DESC
      `;
      return { success: true, projects };
    }

    // Get projects by category
    if (action === "getByCategory" && category) {
      const projects = await sql`
        SELECT p.*, m.file_url as image_url 
        FROM projects p
        LEFT JOIN media m ON p.image_id = m.id
        WHERE p.category = ${category}
        ORDER BY p.display_order ASC, p.created_at DESC
      `;
      return { success: true, projects };
    }

    // Get a single project by ID
    if (action === "getById" && projectId) {
      const projects = await sql`
        SELECT p.*, m.file_url as image_url 
        FROM projects p
        LEFT JOIN media m ON p.image_id = m.id
        WHERE p.id = ${projectId}
      `;

      if (projects.length === 0) {
        return { success: false, message: "Project not found" };
      }

      return { success: true, project: projects[0] };
    }

    // Get a single project by slug
    if (action === "getBySlug" && slug) {
      const projects = await sql`
        SELECT p.*, m.file_url as image_url 
        FROM projects p
        LEFT JOIN media m ON p.image_id = m.id
        WHERE p.slug = ${slug}
      `;

      if (projects.length === 0) {
        return { success: false, message: "Project not found" };
      }

      return { success: true, project: projects[0] };
    }

    // Create a new project
    if (action === "create" && projectData) {
      try {
        const projectsPath = 'src/data/projects.json';
        const existingProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        let websiteMeta = {};
        if (projectData.category === 'websites' && projectData.project_link) {
          websiteMeta = await fetchWebsiteMeta(projectData.project_link);
        }
        const newProject = {
          id: Date.now(),
          title: projectData.title,
          category: projectData.category,
          description: projectData.description,
          full_description: projectData.full_description,
          image_url: projectData.image_url,
          additional_images: projectData.additional_images || [],
          pdfs: projectData.pdfs || [],
          client: projectData.client,
          duration: projectData.duration,
          technologies: projectData.technologies || [],
          tags: projectData.tags || [],
          challenge: projectData.challenge,
          solution: projectData.solution,
          results: projectData.results,
          project_link: projectData.project_link,
          ...websiteMeta,
          featured: projectData.featured || false,
          display_order: projectData.display_order || existingProjects.length + 1,
          videos: projectData.videos || [],
          icons: projectData.icons || [],
          socialMedia: projectData.socialMedia || {},
          designs: projectData.designs || []
        };
        
        existingProjects.push(newProject);
        fs.writeFileSync(projectsPath, JSON.stringify(existingProjects, null, 2));
        
        return { success: true, project: newProject };
      } catch (err) {
        return { success: false, message: 'Failed to create project.' };
      }
    }

    // Update a project
    if (action === "update" && projectId && projectData) {
      try {
        const projectsPath = 'src/data/projects.json';
        const existingProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        
        const projectIndex = existingProjects.findIndex(p => p.id == projectId);
        if (projectIndex === -1) {
          return { success: false, message: "Project not found" };
        }
        
        // Update the project with new data
        existingProjects[projectIndex] = {
          ...existingProjects[projectIndex],
          title: projectData.title,
          category: projectData.category,
          description: projectData.description,
          full_description: projectData.full_description,
          image_url: projectData.image_url,
          additional_images: projectData.additional_images || existingProjects[projectIndex].additional_images || [],
          pdfs: projectData.pdfs || existingProjects[projectIndex].pdfs || [],
          client: projectData.client,
          duration: projectData.duration,
          technologies: projectData.technologies || [],
          tags: projectData.tags || [],
          challenge: projectData.challenge,
          solution: projectData.solution,
          results: projectData.results,
          project_link: projectData.project_link,
          featured: projectData.featured || false,
          display_order: projectData.display_order || existingProjects[projectIndex].display_order,
          videos: projectData.videos || existingProjects[projectIndex].videos || [],
          icons: projectData.icons || existingProjects[projectIndex].icons || [],
          socialMedia: projectData.socialMedia || existingProjects[projectIndex].socialMedia || {},
          designs: projectData.designs || existingProjects[projectIndex].designs || []
        };
        
        fs.writeFileSync(projectsPath, JSON.stringify(existingProjects, null, 2));
        
        return { success: true, project: existingProjects[projectIndex] };
      } catch (err) {
        return { success: false, message: 'Failed to update project.' };
      }
    }

    // Delete a project
    if (action === "delete" && projectId) {
      try {
        const projectsPath = 'src/data/projects.json';
        const existingProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        
        const projectIndex = existingProjects.findIndex(p => p.id == projectId);
        if (projectIndex === -1) {
          return { success: false, message: "Project not found" };
        }
        
        existingProjects.splice(projectIndex, 1);
        fs.writeFileSync(projectsPath, JSON.stringify(existingProjects, null, 2));
        
        return { success: true, message: "Project deleted successfully" };
      } catch (err) {
        return { success: false, message: 'Failed to delete project.' };
      }
    }

    // Update all projects
    if (action === "updateAll" && Array.isArray(projects)) {
      try {
        fs.writeFileSync('src/data/projects.json', JSON.stringify(projects, null, 2));
        return { success: true };
      } catch (err) {
        return { success: false, message: 'Failed to update projects.' };
      }
    }

    return { success: false, message: "Invalid action" };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
      error: error.message,
    };
  }
}
export async function POST(request) {
  const result = await handler(await request.json());
  return NextResponse.json(result);
}