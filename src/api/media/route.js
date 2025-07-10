async function handler({ action, mediaId, mediaData, fileData }) {
  try {
    // Get all media
    if (action === "getAll") {
      const media = await sql`SELECT * FROM media ORDER BY created_at DESC`;
      return { success: true, media };
    }

    // Get a single media item
    if (action === "getOne" && mediaId) {
      const media = await sql`SELECT * FROM media WHERE id = ${mediaId}`;
      if (media.length === 0) {
        return { success: false, message: "Media not found" };
      }
      return { success: true, media: media[0] };
    }

    // Upload new media
    if (action === "upload" && fileData) {
      // Upload the file
      const { url, mimeType, error } = await upload(fileData);

      if (error) {
        return { success: false, message: "Upload failed", error };
      }

      // Extract file type from mime type or use a default
      const fileType = mimeType ? mimeType.split("/")[0] : "unknown";

      // Insert the media record
      const result = await sql`
        INSERT INTO media (
          filename, 
          original_filename, 
          file_url, 
          file_type, 
          file_size, 
          width, 
          height, 
          alt_text
        ) VALUES (
          ${mediaData.filename || "untitled"},
          ${mediaData.originalFilename || "untitled"},
          ${url},
          ${fileType},
          ${mediaData.fileSize || 0},
          ${mediaData.width || null},
          ${mediaData.height || null},
          ${mediaData.altText || null}
        ) RETURNING *
      `;

      return { success: true, media: result[0] };
    }

    // Update media details
    if (action === "update" && mediaId && mediaData) {
      // Build dynamic query for updating only provided fields
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (mediaData.filename) {
        updates.push(`filename = $${paramCount}`);
        values.push(mediaData.filename);
        paramCount++;
      }

      if (mediaData.altText !== undefined) {
        updates.push(`alt_text = $${paramCount}`);
        values.push(mediaData.altText);
        paramCount++;
      }

      if (mediaData.width) {
        updates.push(`width = $${paramCount}`);
        values.push(mediaData.width);
        paramCount++;
      }

      if (mediaData.height) {
        updates.push(`height = $${paramCount}`);
        values.push(mediaData.height);
        paramCount++;
      }

      // Add updated_at timestamp
      updates.push(`updated_at = now()`);

      if (updates.length === 0) {
        return { success: false, message: "No fields to update" };
      }

      // Add the ID to the values array
      values.push(mediaId);

      const updateQuery = `
        UPDATE media 
        SET ${updates.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await sql(updateQuery, values);

      if (result.length === 0) {
        return { success: false, message: "Media not found" };
      }

      return { success: true, media: result[0] };
    }

    // Delete media
    if (action === "delete" && mediaId) {
      // Check if the media is referenced by any projects
      const references = await sql`
        SELECT COUNT(*) FROM projects WHERE image_id = ${mediaId}
      `;

      if (references[0].count > 0) {
        return {
          success: false,
          message: "Cannot delete media that is referenced by projects",
        };
      }

      const result = await sql`
        DELETE FROM media WHERE id = ${mediaId} RETURNING *
      `;

      if (result.length === 0) {
        return { success: false, message: "Media not found" };
      }

      return { success: true, message: "Media deleted successfully" };
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