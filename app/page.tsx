'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getAllPriests } from '@/lib/priests';
import { PriestProfile } from '@/types/priest';
import Image from 'next/image';
import Link from 'next/link';
// import HeroSection from '@/components/ui/HeroSection';
// import FeaturedPriests from '@/components/priest/FeaturedPriests';
// import ServicesSection from '@/components/ui/ServicesSection';
// import TestimonialsSection from '@/components/ui/TestimonialsSection';
// import HowItWorks from '@/components/ui/HowItWorks';

export default function HomePage() {
  const { user, isPriest } = useAuth();
  const [featuredPriests, setFeaturedPriests] = useState<PriestProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFeaturedPriests = async () => {
      try {
        // Get top rated priests for featuring on homepage
        const { priests } = await getAllPriests(4);
        setFeaturedPriests(priests);
      } catch (error) {
        console.error('Error loading featured priests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPriests();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (isPriest) {
        router.push('/dashboard/priest');
      } else {
        router.push('/dashboard/user');
      }
    } else {
      router.push('/auth/register');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <HeroSection onGetStarted={handleGetStarted} />

      {/* How It Works Section */}
      {/* <HowItWorks /> */}

      {/* Featured Priests Section */}
      {/* <FeaturedPriests priests={featuredPriests} loading={loading} /> */}

      {/* Services Section */}
      {/* <ServicesSection /> */}

      {/* Testimonials Section */}
      {/* <TestimonialsSection /> */} 

      {/* Call to Action Section */}
      <section className="bg-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book a Priest?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our platform to connect with experienced priests for your spiritual needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Get Started
            </button>
            <Link
              href="/priests"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Browse Priests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}