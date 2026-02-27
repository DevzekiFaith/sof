"use client";

import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import AnimatedSection from "../components/ui/AnimatedSection";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="simple" />

      {/* Contact Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-8 sm:mb-12 leading-tight px-4">
              Get in Touch
            </h1>
          </AnimatedSection>

          {submitted ? (
            <AnimatedSection>
              <div className="p-6 sm:p-8 bg-gray-100 rounded-2xl mb-8 mx-4 sm:mx-0 border-2 border-gray-200 shadow-lg">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  Thank you! We&apos;ll get back to you soon.
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 px-4 sm:px-0">
              <AnimatedSection delay={100}>
                <div>
                  <label className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-lg sm:text-xl transition-all duration-300 hover:border-gray-300 focus:shadow-lg"
                    required
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={150}>
                <div>
                  <label className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-lg sm:text-xl transition-all duration-300 hover:border-gray-300 focus:shadow-lg"
                    required
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div>
                  <label className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-lg sm:text-xl transition-all duration-300 hover:border-gray-300 focus:shadow-lg"
                    required
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={250}>
                <div>
                  <label className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-lg sm:text-xl resize-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg"
                    required
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </AnimatedSection>
            </form>
          )}

          <AnimatedSection delay={400}>
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-gray-200 px-4 sm:px-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="group">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">Email</p>
                  <p className="text-lg sm:text-xl text-gray-600 group-hover:text-gray-900 transition-colors">contact@selfpay.com</p>
                </div>
                <div className="group">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">Phone</p>
                  <p className="text-lg sm:text-xl text-gray-600 group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</p>
                </div>
                <div className="group">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">Office Hours</p>
                  <p className="text-lg sm:text-xl text-gray-600 group-hover:text-gray-900 transition-colors">Monday - Friday, 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

