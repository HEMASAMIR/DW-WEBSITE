'use client';

import HeroSection from '@/components/home/HeroSection';
import CoursesSection from '@/components/home/CoursesSection';
import BooksSection from '@/components/home/BooksSection';
import BranchesSection from '@/components/home/BranchesSection';
import AboutTeacherSection from '@/components/home/AboutTeacherSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <CoursesSection />
      <BooksSection />
      <BranchesSection />
      <AboutTeacherSection />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
