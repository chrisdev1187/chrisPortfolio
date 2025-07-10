import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faBrain,
  faVrCardboard,
  faPalette,
  faEnvelope,
  faMapMarkerAlt,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "@/components/ContactForm";
import ClientLayout from '@/components/ClientLayout';
import HomePageClient from '@/components/HomePageClient';

import contactData from '@/data/contact.json';
import testimonialsData from '@/data/testimonials.json';
import allProjectsData from '@/data/projects.json';

export default async function Home() {
  const testimonials = testimonialsData;
  const projects = allProjectsData.filter(p => p.featured);

  // Use /media/profile.jpg as the profile image
  const profileImage = '/media/profile.jpg';

  const services = [
    {
      icon: faCode,
      title: "Interactive Development",
      description:
        "Creating engaging web experiences with cutting-edge technologies like React, Three.js, and WebGL.",
    },
    {
      icon: faBrain,
      title: "AI Integration",
      description:
        "Implementing machine learning and AI solutions to create intelligent, adaptive digital experiences.",
    },
    {
      icon: faVrCardboard,
      title: "Advanced UI/UX",
      description:
        "Designing advanced user interfaces and experiences that delight users and drive engagement across digital platforms.",
    },
    {
      icon: faPalette,
      title: "Creative Technology",
      description:
        "Merging art and technology to create innovative digital installations and interactive art pieces.",
    },
  ];

  return (
    <ClientLayout>
      <HomePageClient projects={projects} services={services} contactData={contactData} profileImage={profileImage} testimonials={testimonials} />
    </ClientLayout>
  );
}