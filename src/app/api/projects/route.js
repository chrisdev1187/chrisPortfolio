import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client (for server-side operations)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SUPABASE_MEDIA_URL = `${SUPABASE_URL}/storage/v1/object/public/chrisp/`;

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
}) {
  const transformProjectMediaUrls = (project) => {
    let updatedProject = { ...project };

    if (updatedProject.image_url && !updatedProject.image_url.startsWith('http')) {
      updatedProject.image_url = SUPABASE_MEDIA_URL + updatedProject.image_url;
    }
    if (Array.isArray(updatedProject.additional_images)) {
      updatedProject.additional_images = updatedProject.additional_images.map(img => {
        if (img && !img.startsWith('http')) {
          return SUPABASE_MEDIA_URL + img;
        }
        return img;
      });
    }
    if (Array.isArray(updatedProject.videos)) {
      updatedProject.videos = updatedProject.videos.map(vid => {
        if (vid && !vid.startsWith('http') && !vid.includes('youtube.com') && !vid.includes('youtu.be')) {
          return SUPABASE_MEDIA_URL + vid;
        }
        return vid;
      });
    }
    if (Array.isArray(updatedProject.pdfs)) {
      updatedProject.pdfs = updatedProject.pdfs.map(pdf => {
        if (pdf.url && !pdf.url.startsWith('http')) {
          return { ...pdf, url: SUPABASE_MEDIA_URL + pdf.url };
        }
        return pdf;
      });
    }
    if (Array.isArray(updatedProject.designs)) {
      updatedProject.designs = updatedProject.designs.map(design => {
        if (design && !design.startsWith('http')) {
          return SUPABASE_MEDIA_URL + design;
        }
        return design;
      });
    }

    return updatedProject;
  };

  try {
    // Get all projects
    if (action === "getAll") {
      const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      const transformedProjects = data.map(transformProjectMediaUrls);
      return { success: true, projects: transformedProjects };
    }

    // Get featured projects
    if (action === "getFeatured") {
      const { data, error } = await supabase.from('projects').select('*').eq('featured', true).order('display_order', { ascending: true });
      if (error) throw error;
      const transformedProjects = data.map(transformProjectMediaUrls);
      return { success: true, projects: transformedProjects };
    }

    // Get projects by category
    if (action === "getByCategory" && category) {
      const { data, error } = await supabase.from('projects').select('*').eq('category', category).order('display_order', { ascending: true });
      if (error) throw error;
      const transformedProjects = data.map(transformProjectMediaUrls);
      return { success: true, projects: transformedProjects };
    }

    // Get a single project by ID
    if (action === "getById" && projectId) {
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (error) throw error;
      if (!data) {
        return { success: false, message: "Project not found" };
      }
      return { success: true, project: transformProjectMediaUrls(data) };
    }

    // Get a single project by slug
    if (action === "getBySlug" && slug) {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error) throw error;
      if (!data) {
        return { success: false, message: "Project not found" };
      }
      return { success: true, project: transformProjectMediaUrls(data) };
    }

    // Create a new project
    if (action === "create" && projectData) {
      let websiteMeta = {};
      if (projectData.category === 'websites' && projectData.project_link) {
        websiteMeta = await fetchWebsiteMeta(projectData.project_link);
      }
      const newProject = {
        ...projectData,
        ...websiteMeta,
      };
      const { data, error } = await supabase.from('projects').insert([newProject]).select();
      if (error) throw error;
      return { success: true, project: transformProjectMediaUrls(data[0]) };
    }

    // Update a project
    if (action === "update" && projectId && projectData) {
      const { data, error } = await supabase.from('projects').update(projectData).eq('id', projectId).select();
      if (error) throw error;
      if (!data || data.length === 0) {
        return { success: false, message: "Project not found" };
      }
      return { success: true, project: transformProjectMediaUrls(data[0]) };
    }

    // Delete a project
    if (action === "delete" && projectId) {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) throw error;
      return { success: true, message: "Project deleted successfully" };
    }

    return { success: false, message: "Invalid action or missing parameters" };
  } catch (error) {
    console.error("API Handler Error:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

export async function POST(request) {
  const body = await request.json();
  const result = await handler(body);

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ message: result.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const projectId = searchParams.get('projectId');
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const featured = searchParams.get('featured') === 'true';

  // For GET requests, we primarily support fetching data, not mutations
  if (action === "getAll" || action === "getFeatured" || action === "getByCategory" || action === "getById" || action === "getBySlug") {
    const result = await handler({ action, projectId, category, slug, featured });
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Invalid GET action" }, { status: 400 });
}