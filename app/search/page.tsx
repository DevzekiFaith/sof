"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { courses } from "../data/courses";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(courses);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.fullDescription.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-black mb-8">Search Courses</h1>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for courses..."
              className="w-full pl-12 pr-4 py-4 bg-[#181818] border border-[#282828] rounded-lg focus:border-[#1ed760] focus:outline-none text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[#b3b3b3]">No courses found matching your search.</p>
            </div>
          ) : (
            searchResults.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block bg-[#181818] rounded-lg p-6 border border-[#282828] hover:border-[#1ed760] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${course.bgGradient}`}>
                    <course.icon className={`w-6 h-6 ${course.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-[#b3b3b3] line-clamp-2">{course.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#1ed760] font-bold">${course.priceUSD}</span>
                      <span className="text-xs text-[#a7a7a7]">{course.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
