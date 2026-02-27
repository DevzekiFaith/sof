"use client";

import AnimatedSection from "../ui/AnimatedSection";

interface Testimonial {
  name: string;
  age: string;
  course: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    age: "28",
    course: "Capital Development",
    text: "This course transformed how I think about money and investments. The practical approach made complex concepts easy to understand.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    age: "22",
    course: "Persuasion",
    text: "The persuasion course helped me excel in my sales career. I've seen immediate results in my communication and negotiation skills.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    age: "35",
    course: "Decision-Making",
    text: "As a manager, decision-making under pressure was challenging. This course gave me frameworks that I use daily in my role.",
    rating: 5,
  },
  {
    name: "David Thompson",
    age: "19",
    course: "Team Person",
    text: "Learning to work effectively in teams has been invaluable. The course helped me become a better collaborator and leader.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t-2 border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              What Our Students Say
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 text-center mb-12 sm:mb-16">
              Real stories from real learners
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg sm:text-xl text-gray-700 italic mb-6">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div className="border-t-2 border-gray-100 pt-4">
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        Age {testimonial.age} • {testimonial.course}
                      </div>
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
