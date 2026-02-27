"use client";

import { useState } from "react";
import { SearchIcon } from "../Icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search courses..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full max-w-md transition-all duration-300 ${isFocused ? "scale-105" : ""}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className={`w-5 h-5 transition-colors duration-300 ${isFocused ? "text-black" : "text-gray-400"}`} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all duration-300 text-lg hover:border-gray-300 shadow-sm focus:shadow-lg"
      />
    </div>
  );
}

