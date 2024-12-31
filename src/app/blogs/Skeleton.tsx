import React from "react";

function Skeleton() {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index}>
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg" />
              <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-300 animate-pulse w-8 h-8" />
            </div>
            <div>
              <div className="h-5 bg-gray-200 animate-pulse rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
    </>
  );
}

export default Skeleton;
