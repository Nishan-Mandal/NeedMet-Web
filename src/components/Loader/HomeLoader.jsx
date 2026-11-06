import React from "react";

const Box = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`}></div>
);

const HomeLoader = () => {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-20 py-8 flex flex-col gap-8 md:gap-10">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <Box className="h-3.5 w-28" />
          <Box className="h-10 rounded-full" />

          <div className="flex flex-wrap gap-2">
            {Array(8).fill(0).map((_, i) => (
              <Box key={i} className="h-6 w-20 md:w-24 !rounded-full" />
            ))}
          </div>
        </div>

        {/* Right */}
        <Box className="h-44 sm:h-52 md:h-64 w-full !rounded-2xl" />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-4">
        <Box className="h-[18px] w-32 md:w-36" />

        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Box className="h-10 w-10 sm:h-12 sm:w-12 !rounded-xl" />
              <Box className="h-2.5 w-10 sm:w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Newly Added */}
      <div className="flex flex-col gap-4">
        <Box className="h-[18px] w-32 md:w-36" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <Box className="h-28 sm:h-36 md:h-40 w-full !rounded-xl" />
              <Box className="h-4 w-3/4" />
              <Box className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="flex flex-col gap-4">
        <Box className="h-[18px] w-32 md:w-36" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <Box className="h-28 sm:h-36 md:h-40 w-full !rounded-xl" />
              <Box className="h-4 w-3/4" />
              <Box className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;