'use client';

import HeroSection from '@/components/home/HeroSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import CoursesSection from '@/components/home/CoursesSection';
import BooksSection from '@/components/home/BooksSection';
import AboutTeacherSection from '@/components/home/AboutTeacherSection';
import BranchesSection from '@/components/home/BranchesSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <ReviewsSection />
      <CoursesSection />
      <BooksSection />
      <AboutTeacherSection />
      <BranchesSection />
      <ContactSection />
    </div>
  );
}
