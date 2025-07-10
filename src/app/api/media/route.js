import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mediaDir = path.join(process.cwd(), 'public', 'media');

function ensureMediaDir() {
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
}

export async function GET() {
  ensureMediaDir();
  const files = fs.readdirSync(mediaDir);
  return NextResponse.json({ files });
}

export async function POST(request) {
  ensureMediaDir();
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  let filename = file.name
    .replace(/[^a-zA-Z0-9.()_-]/g, '_') // keep . ( ) _ -
    .replace(/[\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  // Optionally, remove parentheses for extra safety
  filename = filename.replace(/[()]/g, '_');
  const filePath = path.join(mediaDir, filename);
  fs.writeFileSync(filePath, buffer);
  return NextResponse.json({ success: true, filename });
}

export async function DELETE(request) {
  ensureMediaDir();
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  if (!filename) {
    return NextResponse.json({ success: false, message: 'No filename provided' });
  }
  const filePath = path.join(mediaDir, filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ success: false, message: 'File not found' });
  }
  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true });
} 