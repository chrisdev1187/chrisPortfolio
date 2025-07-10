async function handler({ action, testimonialId, testimonialData }) {
  try {
    // Get all testimonials
    if (action === "getAll") {
      const testimonials = await sql`
        SELECT t.*, m.file_url as client_image_url 
        FROM testimonials t
        LEFT JOIN media m ON t.client_image_id = m.id
        ORDER BY t.display_order ASC, t.created_at DESC
      `;
      return { success: true, testimonials };
    }

    // Get a single testimonial
    if (action === "getOne" && testimonialId) {
      const testimonials = await sql`
        SELECT t.*, m.file_url as client_image_url 
        FROM testimonials t
        LEFT JOIN media m ON t.client_image_id = m.id
        WHERE t.id = ${testimonialId}
      `;

      if (testimonials.length === 0) {
        return { success: false, message: "Testimonial not found" };
      }

      return { success: true, testimonial: testimonials[0] };
    }

    // Create a new testimonial
    if (action === "create" && testimonialData) {
      const result = await sql`
        INSERT INTO testimonials (
          client_name,
          client_title,
          testimonial_text,
          client_image_id,
          display_order
        ) VALUES (
          ${testimonialData.clientName},
          ${testimonialData.clientTitle},
          ${testimonialData.testimonialText},
          ${testimonialData.clientImageId || null},
          ${testimonialData.displayOrder || 0}
        ) RETURNING *
      `;

      return { success: true, testimonial: result[0] };
    }

    // Update an existing testimonial
    if (action === "update" && testimonialId && testimonialData) {
      // Build dynamic query for updating only provided fields
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (testimonialData.clientName !== undefined) {
        updates.push(`client_name = $${paramCount}`);
        values.push(testimonialData.clientName);
        paramCount++;
      }

      if (testimonialData.clientTitle !== undefined) {
        updates.push(`client_title = $${paramCount}`);
        values.push(testimonialData.clientTitle);
        paramCount++;
      }

      if (testimonialData.testimonialText !== undefined) {
        updates.push(`testimonial_text = $${paramCount}`);
        values.push(testimonialData.testimonialText);
        paramCount++;
      }

      if (testimonialData.clientImageId !== undefined) {
        updates.push(`client_image_id = $${paramCount}`);
        values.push(testimonialData.clientImageId);
        paramCount++;
      }

      if (testimonialData.displayOrder !== undefined) {
        updates.push(`display_order = $${paramCount}`);
        values.push(testimonialData.displayOrder);
        paramCount++;
      }

      // Add updated_at timestamp
      updates.push(`updated_at = now()`);

      if (updates.length === 0) {
        return { success: false, message: "No fields to update" };
      }

      // Add the ID to the values array
      values.push(testimonialId);

      const updateQuery = `
        UPDATE testimonials 
        SET ${updates.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await sql(updateQuery, values);

      if (result.length === 0) {
        return { success: false, message: "Testimonial not found" };
      }

      return { success: true, testimonial: result[0] };
    }

    // Delete a testimonial
    if (action === "delete" && testimonialId) {
      const result = await sql`
        DELETE FROM testimonials 
        WHERE id = ${testimonialId} 
        RETURNING *
      `;

      if (result.length === 0) {
        return { success: false, message: "Testimonial not found" };
      }

      return { success: true, message: "Testimonial deleted successfully" };
    }

    // Update display order for multiple testimonials
    if (
      action === "updateOrder" &&
      testimonialData &&
      Array.isArray(testimonialData.items)
    ) {
      const results = await sql.transaction(async (txn) => {
        const updates = [];

        for (const item of testimonialData.items) {
          const result = await txn`
            UPDATE testimonials 
            SET display_order = ${item.displayOrder}, 
                updated_at = now() 
            WHERE id = ${item.id} 
            RETURNING *
          `;
          updates.push(result[0]);
        }

        return updates;
      });

      return { success: true, testimonials: results };
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