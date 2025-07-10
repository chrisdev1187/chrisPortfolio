import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const categoriesPath = path.join(process.cwd(), 'src', 'data', 'categories.json');

export async function GET() {
  try {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to load categories' });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, categories } = body;

    if (action === 'getAll') {
      const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      return NextResponse.json({ success: true, categories });
    }

    if (action === 'updateAll') {
      fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
      return NextResponse.json({ success: true, message: 'Categories updated successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update categories' });
  }
} 