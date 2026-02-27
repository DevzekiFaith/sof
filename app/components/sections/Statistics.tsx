"use client";

import { useEffect, useState, useRef } from "react";
import AnimatedSection from "../ui/AnimatedSection";

interface Stat {
  number: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { number: "1000", label: "Students Enrolled", suffix: "+" },
  { number: "8", label: "Core Courses" },
  { number: "10", label: "Age Range", suffix: "-45" },
  { number: "95", label: "Success Rate", suffix: "%" },
];

export default function Statistics() {
  const [countedStats, setCountedStats] = useState<Stat[]>(stats.map(s => ({ ...s, number: "0" })));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const counters = stats.map((stat, index) => {
            const target = parseInt(stat.number);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCountedStats(prev => {
                const newStats = [...prev];
                newStats[index] = { ...stat, number: Math.floor(current).toString() };
                return newStats;
              });
            }, 16);

            return timer;
          });

          return () => counters.forEach(timer => clearInterval(timer));
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white border-t-2 border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-12 sm:mb-16 text-center">
              By The Numbers
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {countedStats.map((stat, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="text-center p-6 sm:p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                      {stat.number}{stat.suffix}
                    </div>
                    <div className="text-base sm:text-lg text-gray-600 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

