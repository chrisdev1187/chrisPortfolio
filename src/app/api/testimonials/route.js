import { NextResponse } from 'next/server';
import fs from 'fs';

const filePath = 'src/data/testimonials.json';

export async function GET() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request) {
  const body = await request.json();
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
} 