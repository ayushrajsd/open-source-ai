import React from "react";

function SkeletonLoader({ count = 2 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
        >
          <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
