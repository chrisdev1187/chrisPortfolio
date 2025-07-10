import { promises as fs } from 'fs';
import path from 'path';
import AboutClient from './AboutClient';

async function getAboutData() {
  const testimonialsPath = path.join(process.cwd(), 'src', 'data', 'testimonials.json');
  const testimonialsContent = await fs.readFile(testimonialsPath, 'utf8');
  const testimonials = JSON.parse(testimonialsContent);
  return { testimonials };
}

export default async function AboutPage() {
  const { testimonials } = await getAboutData();
  return <AboutClient testimonials={testimonials} />;
}
