"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { OrderProgress, PaymentStatus } from "@prisma/client";

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: Float32Array;
  createdAt: Date;
  orderProgress: OrderProgress;
  paymentStatus: PaymentStatus;
  address: {
    firstName: string;
    lastName: string;
  } | null;
}

const OrderSkeleton = () => (
  <tr>
    <td className="border-[#eee] px-4 py-4 xl:pl-7 border-b">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="border-[#eee] px-4 py-4 xl:pl-7 border-b">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="border-[#eee] px-4 py-4 border-b">
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="border-[#eee] px-4 py-4 border-b">
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="border-[#eee] px-4 py-4 xl:pr-7 border-b">
      <div className="flex items-center justify-end space-x-3.5">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/orders${filter !== "ALL" ? `?status=${filter}` : ""}`
      );
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (
    status: OrderProgress,
    paymentStatus: PaymentStatus
  ) => {
    if (paymentStatus === "PAID") return "bg-[#219653]/[0.08] text-[#219653]";
    if (paymentStatus === "PENDING")
      return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
    return "bg-[#D34053]/[0.08] text-[#D34053]";
  };

  return (
    <>
      <div className="relative z-10 rounded-lg bg-white shadow-md mb-4 px-4 py-4 md:px-6 2xl:px-7 flex items-center justify-start flex-wrap">
        {Object.values(OrderProgress).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`mr-4 py-3 px-7 rounded-sm ${
              filter === status
                ? "bg-green-500 text-white"
                : "bg-gray-100 hover:bg-green-500 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:p-7">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left ">
                <th className="min-w-[220px] px-4 py-4 font-medium text-gray-700 xl:pl-7">
                  Order ID
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-gray-700 xl:pl-7">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-gray-700">
                  Order date
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-4 text-right font-medium text-gray-700 xl:pr-7">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Show skeleton loading rows
                [...Array(5)].map((_, index) => (
                  <OrderSkeleton key={`skeleton-${index}`} />
                ))
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td
                      className={`border-[#eee] px-4 py-4 xl:pl-7 ${
                        index === orders.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td
                      className={`border-[#eee] px-4 py-4 xl:pl-7 ${
                        index === orders.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <h5 className="text-gray-700">
                        {order.address
                          ? `${order.address.firstName} ${order.address.lastName}`
                          : "N/A"}
                      </h5>
                    </td>
                    <td
                      className={`border-[#eee] px-4 py-4 ${
                        index === orders.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <p className="text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td
                      className={`border-[#eee] px-4 py-4 ${
                        index === orders.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <p
                        className={`inline-flex rounded-full px-3.5 py-1 text-sm font-medium ${getStatusColor(
                          order.orderProgress,
                          order.paymentStatus
                        )}`}
                      >
                        {order.orderProgress}
                      </p>
                    </td>
                    <td
                      className={`border-[#eee] px-4 py-4 xl:pr-7 ${
                        index === orders.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <div className="flex items-center justify-end space-x-3.5">
                        <Link
                          href={`/Orders/Order-Detail/${order.id}`}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current hover:fill-[#14AE5C]"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237 7.63475Z"
                              fill=""
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Orders;
