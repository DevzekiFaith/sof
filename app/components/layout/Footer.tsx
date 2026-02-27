import Link from "next/link";
import Logo from "../Logo";
import Copyright from "../Copyright";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-50 via-white to-orange-50 border-t-2 border-gray-200 mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main brand section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-4 tracking-tight">
            Self-Pay
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            &quot;Where Every Learner Becomes a Creator&quot;
          </p>
          <p className="text-base text-gray-600 mt-2 max-w-2xl mx-auto">
            Empowering minds from 10 to 45 with skills that shape the future.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Link
            href="/#courses"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Explore Courses
          </Link>
          <Link
            href="/contact"
            className="bg-white border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-lg hover:border-orange-400 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Get in Touch
          </Link>
          <Link
            href="/about"
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Our Story
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-1 text-center lg:text-left">
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
              We believe every person has unlimited potential. Our mission is simple: provide the best learning experience that turns dreams into reality.
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-800">6</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-800">10-45</div>
                <div className="text-sm text-gray-600">Age Range</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#courses"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Closing section */}
        <div className="text-center border-t border-gray-200 pt-8 sm:pt-12">
          <div className="max-w-3xl mx-auto mb-6">
            <p className="text-lg text-gray-700 mb-4">
              &quot;The beautiful thing about learning is that no one can take it away from you.&quot;
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span>Quality Education</span>
              <span>Lifelong Learning</span>
              <span>Skill Development</span>
              <span>Creative Thinking</span>
            </div>
          </div>
          <Copyright />
        </div>
      </div>
    </footer>
  );
}

