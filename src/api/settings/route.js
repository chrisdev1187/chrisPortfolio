async function handler({ action, contactData, settingsData, statsData }) {
  try {
    // Contact Info Operations
    if (action === "getContactInfo") {
      const contactInfo =
        await sql`SELECT * FROM contact_info ORDER BY id LIMIT 1`;
      return {
        success: true,
        contactInfo: contactInfo.length > 0 ? contactInfo[0] : null,
      };
    }

    if (action === "updateContactInfo" && contactData) {
      // Check if contact info exists
      const existingContact = await sql`SELECT id FROM contact_info LIMIT 1`;

      if (existingContact.length === 0) {
        // Create new contact info if it doesn't exist
        const result = await sql`
          INSERT INTO contact_info (
            email,
            phone,
            linkedin_url,
            github_url,
            twitter_url,
            instagram_url,
            facebook_url,
            youtube_url,
            website_url,
            address
          ) VALUES (
            ${contactData.email},
            ${contactData.phone || null},
            ${contactData.linkedinUrl || null},
            ${contactData.githubUrl || null},
            ${contactData.twitterUrl || null},
            ${contactData.instagramUrl || null},
            ${contactData.facebookUrl || null},
            ${contactData.youtubeUrl || null},
            ${contactData.websiteUrl || null},
            ${contactData.address || null}
          ) RETURNING *
        `;
        return { success: true, contactInfo: result[0] };
      } else {
        // Update existing contact info
        const contactId = existingContact[0].id;

        // Build dynamic query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (contactData.email !== undefined) {
          updates.push(`email = $${paramCount}`);
          values.push(contactData.email);
          paramCount++;
        }

        if (contactData.phone !== undefined) {
          updates.push(`phone = $${paramCount}`);
          values.push(contactData.phone);
          paramCount++;
        }

        if (contactData.linkedinUrl !== undefined) {
          updates.push(`linkedin_url = $${paramCount}`);
          values.push(contactData.linkedinUrl);
          paramCount++;
        }

        if (contactData.githubUrl !== undefined) {
          updates.push(`github_url = $${paramCount}`);
          values.push(contactData.githubUrl);
          paramCount++;
        }

        if (contactData.twitterUrl !== undefined) {
          updates.push(`twitter_url = $${paramCount}`);
          values.push(contactData.twitterUrl);
          paramCount++;
        }

        if (contactData.instagramUrl !== undefined) {
          updates.push(`instagram_url = $${paramCount}`);
          values.push(contactData.instagramUrl);
          paramCount++;
        }

        if (contactData.facebookUrl !== undefined) {
          updates.push(`facebook_url = $${paramCount}`);
          values.push(contactData.facebookUrl);
          paramCount++;
        }

        if (contactData.youtubeUrl !== undefined) {
          updates.push(`youtube_url = $${paramCount}`);
          values.push(contactData.youtubeUrl);
          paramCount++;
        }

        if (contactData.websiteUrl !== undefined) {
          updates.push(`website_url = $${paramCount}`);
          values.push(contactData.websiteUrl);
          paramCount++;
        }

        if (contactData.address !== undefined) {
          updates.push(`address = $${paramCount}`);
          values.push(contactData.address);
          paramCount++;
        }

        updates.push(`updated_at = now()`);

        if (updates.length === 0) {
          return { success: false, message: "No fields to update" };
        }

        values.push(contactId);

        const updateQuery = `
          UPDATE contact_info 
          SET ${updates.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING *
        `;

        const result = await sql(updateQuery, values);
        return { success: true, contactInfo: result[0] };
      }
    }

    // Site Settings Operations
    if (action === "getSiteSettings") {
      const settings = await sql`
        SELECT s.*, m.file_url as profile_image_url 
        FROM site_settings s
        LEFT JOIN media m ON s.profile_image_id = m.id
        ORDER BY s.id LIMIT 1
      `;
      return {
        success: true,
        settings: settings.length > 0 ? settings[0] : null,
      };
    }

    if (action === "updateSiteSettings" && settingsData) {
      // Check if settings exist
      const existingSettings = await sql`SELECT id FROM site_settings LIMIT 1`;

      if (existingSettings.length === 0) {
        // Create new settings if they don't exist
        const result = await sql`
          INSERT INTO site_settings (
            site_title,
            tagline,
            about_short,
            about_full,
            years_experience,
            projects_completed,
            happy_clients,
            technologies_count,
            profile_image_id
          ) VALUES (
            ${settingsData.siteTitle},
            ${settingsData.tagline},
            ${settingsData.aboutShort},
            ${settingsData.aboutFull},
            ${settingsData.yearsExperience},
            ${settingsData.projectsCompleted},
            ${settingsData.happyClients},
            ${settingsData.technologiesCount},
            ${settingsData.profileImageId || null}
          ) RETURNING *
        `;
        return { success: true, settings: result[0] };
      } else {
        // Update existing settings
        const settingsId = existingSettings[0].id;

        // Build dynamic query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (settingsData.siteTitle !== undefined) {
          updates.push(`site_title = $${paramCount}`);
          values.push(settingsData.siteTitle);
          paramCount++;
        }

        if (settingsData.tagline !== undefined) {
          updates.push(`tagline = $${paramCount}`);
          values.push(settingsData.tagline);
          paramCount++;
        }

        if (settingsData.aboutShort !== undefined) {
          updates.push(`about_short = $${paramCount}`);
          values.push(settingsData.aboutShort);
          paramCount++;
        }

        if (settingsData.aboutFull !== undefined) {
          updates.push(`about_full = $${paramCount}`);
          values.push(settingsData.aboutFull);
          paramCount++;
        }

        if (settingsData.yearsExperience !== undefined) {
          updates.push(`years_experience = $${paramCount}`);
          values.push(settingsData.yearsExperience);
          paramCount++;
        }

        if (settingsData.projectsCompleted !== undefined) {
          updates.push(`projects_completed = $${paramCount}`);
          values.push(settingsData.projectsCompleted);
          paramCount++;
        }

        if (settingsData.happyClients !== undefined) {
          updates.push(`happy_clients = $${paramCount}`);
          values.push(settingsData.happyClients);
          paramCount++;
        }

        if (settingsData.technologiesCount !== undefined) {
          updates.push(`technologies_count = $${paramCount}`);
          values.push(settingsData.technologiesCount);
          paramCount++;
        }

        if (settingsData.profileImageId !== undefined) {
          updates.push(`profile_image_id = $${paramCount}`);
          values.push(settingsData.profileImageId);
          paramCount++;
        }

        updates.push(`updated_at = now()`);

        if (updates.length === 0) {
          return { success: false, message: "No fields to update" };
        }

        values.push(settingsId);

        const updateQuery = `
          UPDATE site_settings 
          SET ${updates.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING *
        `;

        const result = await sql(updateQuery, values);
        return { success: true, settings: result[0] };
      }
    }

    // Stats Operations
    if (action === "updateStats" && statsData) {
      // Update site settings with stats data
      const existingSettings = await sql`SELECT id FROM site_settings LIMIT 1`;

      if (existingSettings.length === 0) {
        // Create new settings with stats if they don't exist
        const result = await sql`
          INSERT INTO site_settings (
            years_experience,
            projects_completed,
            happy_clients,
            technologies_count
          ) VALUES (
            ${statsData.yearsExperience || 0},
            ${statsData.projectsCompleted || 0},
            ${statsData.happyClients || 0},
            ${statsData.awardsWon || 0}
          ) RETURNING *
        `;
        return { success: true, settings: result[0] };
      } else {
        // Update existing settings with stats
        const settingsId = existingSettings[0].id;

        // Build dynamic query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (statsData.yearsExperience !== undefined) {
          updates.push(`years_experience = $${paramCount}`);
          values.push(statsData.yearsExperience);
          paramCount++;
        }

        if (statsData.projectsCompleted !== undefined) {
          updates.push(`projects_completed = $${paramCount}`);
          values.push(statsData.projectsCompleted);
          paramCount++;
        }

        if (statsData.happyClients !== undefined) {
          updates.push(`happy_clients = $${paramCount}`);
          values.push(statsData.happyClients);
          paramCount++;
        }

        if (statsData.awardsWon !== undefined) {
          updates.push(`technologies_count = $${paramCount}`); // Using technologies_count for awards_won
          values.push(statsData.awardsWon);
          paramCount++;
        }

        updates.push(`updated_at = now()`);

        if (updates.length === 0) {
          return { success: false, message: "No stats to update" };
        }

        values.push(settingsId);

        const updateQuery = `
          UPDATE site_settings 
          SET ${updates.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING *
        `;

        const result = await sql(updateQuery, values);
        return { success: true, settings: result[0] };
      }
    }

    // Get all settings
    if (action === "getAll") {
      const settings = await sql`
        SELECT s.*, m.file_url as profile_image_url 
        FROM site_settings s
        LEFT JOIN media m ON s.profile_image_id = m.id
        ORDER BY s.id LIMIT 1
      `;

      const contactInfo = await sql`
        SELECT * FROM contact_info ORDER BY id LIMIT 1
      `;

      return {
        success: true,
        settings: settings.length > 0 ? settings[0] : null,
        contactInfo: contactInfo.length > 0 ? contactInfo[0] : null,
      };
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
  return handler(await request.json());
}