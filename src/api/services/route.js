async function handler({ action, serviceId, serviceData }) {
  try {
    // Get all services
    if (action === "getAll") {
      const services = await sql`
        SELECT * FROM services 
        ORDER BY display_order ASC, created_at DESC
      `;
      return { success: true, services };
    }

    // Get a single service by ID
    if (action === "getOne" && serviceId) {
      const services = await sql`
        SELECT * FROM services WHERE id = ${serviceId}
      `;

      if (services.length === 0) {
        return { success: false, message: "Service not found" };
      }

      return { success: true, service: services[0] };
    }

    // Create a new service
    if (action === "create" && serviceData) {
      const result = await sql`
        INSERT INTO services (
          title,
          icon,
          short_description,
          full_description,
          features,
          technologies,
          display_order
        ) VALUES (
          ${serviceData.title},
          ${serviceData.icon},
          ${serviceData.shortDescription},
          ${serviceData.fullDescription},
          ${serviceData.features},
          ${serviceData.technologies},
          ${serviceData.displayOrder || 0}
        ) RETURNING *
      `;

      return { success: true, service: result[0] };
    }

    // Update a service
    if (action === "update" && serviceId && serviceData) {
      // Build dynamic query for updating only provided fields
      const updates = [];
      const values = [];
      let paramCount = 1;

      const fields = [
        { key: "title", field: "title" },
        { key: "icon", field: "icon" },
        { key: "shortDescription", field: "short_description" },
        { key: "fullDescription", field: "full_description" },
        { key: "features", field: "features" },
        { key: "technologies", field: "technologies" },
        { key: "displayOrder", field: "display_order" },
      ];

      for (const { key, field } of fields) {
        if (serviceData[key] !== undefined) {
          updates.push(`${field} = $${paramCount}`);
          values.push(serviceData[key]);
          paramCount++;
        }
      }

      // Add updated_at timestamp
      updates.push(`updated_at = now()`);

      if (updates.length === 0) {
        return { success: false, message: "No fields to update" };
      }

      // Add the ID to the values array
      values.push(serviceId);

      const updateQuery = `
        UPDATE services 
        SET ${updates.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await sql(updateQuery, values);

      if (result.length === 0) {
        return { success: false, message: "Service not found" };
      }

      return { success: true, service: result[0] };
    }

    // Delete a service
    if (action === "delete" && serviceId) {
      const result = await sql`
        DELETE FROM services WHERE id = ${serviceId} RETURNING *
      `;

      if (result.length === 0) {
        return { success: false, message: "Service not found" };
      }

      return { success: true, message: "Service deleted successfully" };
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