import React from "react";

const OrderSkeleton = () => {
  return (
    <div className="w-full p-6 rounded-2xl bg-white">
      <div className="">
        <div className="p-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 my-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 my-2"></div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 my-2"></div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div className="h-20 w-20 bg-gray-200 rounded"></div>
            <div className="flex-1 ml-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>

      <div className="text-right flex justify-end">
        <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
      </div>
    </div>
  );
};

export default OrderSkeleton;
