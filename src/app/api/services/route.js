import { NextResponse } from 'next/server';
import fs from 'fs';

const filePath = 'src/data/services.json';

function readServices() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeServices(services) {
  fs.writeFileSync(filePath, JSON.stringify(services, null, 2));
}

export async function POST(request) {
  const body = await request.json();
  let services = readServices();

  switch (body.action) {
    case 'getAll':
      return NextResponse.json({ success: true, services });
    case 'create': {
      const newService = {
        ...body.service,
        id: Date.now(),
        order: services.length,
      };
      services.push(newService);
      writeServices(services);
      return NextResponse.json({ success: true, service: newService });
    }
    case 'update': {
      const idx = services.findIndex(s => s.id === body.id);
      if (idx === -1) return NextResponse.json({ success: false, message: 'Service not found' });
      services[idx] = { ...services[idx], ...body.service };
      writeServices(services);
      return NextResponse.json({ success: true, service: services[idx] });
    }
    case 'delete': {
      const idx = services.findIndex(s => s.id === body.id);
      if (idx === -1) return NextResponse.json({ success: false, message: 'Service not found' });
      services.splice(idx, 1);
      // Reorder remaining
      services = services.map((s, i) => ({ ...s, order: i }));
      writeServices(services);
      return NextResponse.json({ success: true });
    }
    case 'updateOrder': {
      // body.services: [{id, order}]
      for (const { id, order } of body.services) {
        const idx = services.findIndex(s => s.id === id);
        if (idx !== -1) services[idx].order = order;
      }
      services.sort((a, b) => a.order - b.order);
      writeServices(services);
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ success: false, message: 'Invalid action' });
  }
} 