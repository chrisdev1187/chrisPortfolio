const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ensure environment variables are loaded
const envPath = path.resolve(__dirname, '.env.local');
console.log('Attempting to load .env from:', envPath);
require('dotenv').config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for direct inserts

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Supabase URL or Service Role Key is not set in environment variables.');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const projectsFilePath = path.join(__dirname, 'src', 'data', 'projects.json');

async function migrateProjects() {
  try {
    const projectsData = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));

    console.log(`Attempting to insert ${projectsData.length} projects into Supabase...`);

    for (const project of projectsData) {
      // Convert camelCase fields to snake_case for Supabase
      const projectToInsert = { ...project };
      // Rename socialMedia to social_media if present
      if (projectToInsert.socialMedia) {
        projectToInsert.social_media = projectToInsert.socialMedia;
        delete projectToInsert.socialMedia;
      }
      // Convert displayName to display_name in pdfs array
      if (Array.isArray(projectToInsert.pdfs)) {
        projectToInsert.pdfs = projectToInsert.pdfs.map(pdf => {
          if (pdf.displayName) {
            return { ...pdf, display_name: pdf.displayName, displayName: undefined };
          }
          return pdf;
        });
      }
      // Convert themeColor to theme_color if present
      if (projectToInsert.themeColor) {
        projectToInsert.theme_color = projectToInsert.themeColor;
        delete projectToInsert.themeColor;
      }
      // Remove id field, as Supabase will auto-generate it
      delete projectToInsert.id;
      
      const { data, error } = await supabase.from('projects').insert([projectToInsert]);

      if (error) {
        // Log the specific error for debugging
        console.error(`Error inserting project ${project.title || project.id}:`, error);
        // If there's a unique constraint violation (e.g., if you try to insert an existing project again)
        // you might want to handle it differently, e.g., update instead of insert.
        // For now, we'll just log and continue.
      } else {
        console.log(`Successfully inserted project: ${project.title}`);
      }
    }
    console.log('Migration complete!');
  } catch (err) {
    console.error('An error occurred during migration:', err);
  }
}

migrateProjects(); 