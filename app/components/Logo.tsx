export default function Logo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
      <div className="relative">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:scale-110 sm:w-12 sm:h-12 drop-shadow-lg"
        >
          <rect width="36" height="36" rx="10" fill="url(#magify_gradient)" />
          {/* M lettermark */}
          <path
            d="M8 26V10L18 20L28 10V26"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="magify_gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1ed760" />
              <stop offset="1" stopColor="#1db954" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1ed760] to-[#1db954] tracking-tight">
        Magify
      </span>
    </div>
  );
}

