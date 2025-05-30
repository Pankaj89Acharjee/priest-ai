'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import NavbarMain from '@/components/ui/Navbar';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { products } from '@/constants';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { people, testimonials } from '@/constants';
import { GoogleGeminiEffectDemo } from '@/components/GeminiEffect';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";



export default function HomePage() {
  const { user, isPriest } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      if (isPriest) {
        router.push('/dashboard/priest');
      } else {
        router.push(`/dashboard/${user.uid}`);
      }
    } else {
      router.push('/auth/register');
    }
  };



  return (
    // Main container with dark background
    <div className="min-h-screen bg-black text-white relative w-full pt-20">
      {/* Add the FloatingNav component */}
      {/* It will automatically handle the scroll animation */}
      <NavbarMain />

      {/* Hero Section - Adjusted for dark theme and reference style */}
      <section
        id="home" // Add ID for nav link
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Subtle background gradient or pattern (optional) */}
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-black via-gray-900 to-black"></div>
        {/* Optional Grid Background */}
        <div className="absolute inset-0 h-full w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]"></div>


        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6" // Gradient text
          >
            Your All-in-One Priest Zone
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-3xl mx-auto" // Adjusted text color and size
          >
            Experience the extra-ordinary level of hiring a priest with cutting-edge tools designed for everyone. Built with the latest tech for peak performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {/* Styled button similar to reference (using Tailwind) */}
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Now
            </button>
            {/* Optional secondary button */}
            <Link
              href="#features" // Changed link to features section
              className="px-8 py-3 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white transition duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-neutral-950">
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  Unleash the power of <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Dashboard for Priests
                  </span>
                </h1>
              </>
            }
          >
            <Image
              src={`/dash.jpeg`}
              alt="dashImg"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      </section>


      {/* Features Section - Adjusted for dark theme */}
      <section
        id="features" // Add ID for nav link
        className="py-20 sm:py-32 bg-black" // Dark background
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
              Features & Benefits
            </h2>
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
              Discover the tools and features that make Priest the ultimate divine platform.
            </p>
          </div>

          {/* Gemini Effect */}
          <div className="flex flex-col items-center justify-center bg-neutral-900 p-8 rounded-2xl border-neutral-400 hover:border-neutral-100 transition duration-300 shadow-lg shadow-neutral-500/20 border-2 w-full">
            <GoogleGeminiEffectDemo />
          </div>


          {/* Using a grid layout, styled cards similar to reference */}
          <div className="flex flex-col md:flex-row gap-8 w-full mb-10">

            {/* Left: Card */}
            <div className="flex flex-col items-center justify-center bg-neutral-900 p-8 rounded-2xl border-neutral-400 hover:border-neutral-100 transition duration-300 shadow-lg shadow-neutral-500/20 border-2 w-full md:w-[30%] mb-8 md:mb-0 mt-5">
              <div className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
                Our valuable satisfied happy customers
              </div>
              <div className="flex flex-row items-center justify-center w-full">
                <AnimatedTooltip items={people} />
              </div>
            </div>

            {/* Right: Card */}
            <div className="flex flex-col items-center justify-center bg-neutral-900 p-8 rounded-2xl border-neutral-400 hover:border-neutral-100 transition duration-300 shadow-lg shadow-neutral-500/20 border-2 w-full md:w-[70%] mb-8 md:mb-0 mt-5 overflow-hidden">
              <div className="w-full max-w-full" style={{ animation: 'var(--animate-scroll)' }}>
                <InfiniteMovingCards items={testimonials} className="w-full max-w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section - Parallax Component */}
      <section className="py-20 bg-neutral-950">
        <HeroParallax products={products} />
      </section>




      {/* Stats Section - Adjusted for dark theme */}
      <section className="py-20 bg-neutral-950"> {/* Slightly different dark background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '100+', label: 'Supported Priests' }, // Updated label
              { number: '50K+', label: 'Active Users' },
              { number: '24/7', label: 'Community Support' } // Updated label
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{stat.number}</div> {/* Gradient text */}
                <div className="text-xl text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Adjusted for dark theme */}
      <section className="py-20 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            So are you ready to book your priest and event with ease?
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of priests who are already using Priest to deliver the best divine services. Sign up today!
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" // Same style as hero button
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Simple Footer Example */}
      <footer className="py-8 border-t border-neutral-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500">
          &copy; {new Date().getFullYear()} Priest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

