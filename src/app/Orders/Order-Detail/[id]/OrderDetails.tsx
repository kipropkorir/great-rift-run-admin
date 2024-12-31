// src/app/Orders/Order-Detail/[id]/OrderDetails.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderProgress, PaymentStatus } from "@prisma/client";
import OrderSkeleton from "./Skeleton";

interface OrderDetail {
  id: number;
  orderNumber: string;
  orderProgress: OrderProgress;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    street: string;
    house: string;
    additionalInfo?: string;
  };
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageURL1: string;
    };
  }[];
}

const OrderDetails = ({ id }: { id: string }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  const updateOrderStatus = async (status: OrderProgress) => {
    setStatusUpdating(true); // Show loader
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        await fetchOrderDetails();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setStatusUpdating(false); // Hide loader
    }
  };

  if (!order) {
    return (
      <>
        <div className="relative z-10 rounded-[10px] bg-white shadow-1 mb-4 px-4 py-4 md:px-6 2xl:px-7 flex items-center justify-start flex-wrap">
          <ol className="flex items-center whitespace-nowrap">
            <li className="inline-flex items-center">
              <Link
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                href="/Tracking"
              >
                Tracking
                <svg
                  className="shrink-0 mx-2 size-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </Link>
            </li>
            <li className="inline-flex items-center text-sm font-semibold text-gray-800 truncate">
              Order Details
            </li>
          </ol>
        </div>
        <OrderSkeleton />
      </>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="relative z-10 rounded-[10px] bg-white shadow-1 mb-4 px-4 py-4 md:px-6 2xl:px-7 flex items-center justify-start flex-wrap">
        <ol className="flex items-center whitespace-nowrap">
          <li className="inline-flex items-center">
            <Link
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              href="/Orders"
            >
              Orders
              <svg
                className="shrink-0 mx-2 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>
          </li>
          <li className="inline-flex items-center text-sm font-semibold text-gray-800 truncate">
            Order Details
          </li>
        </ol>
      </div>

      {/* Order Details */}
      {loading && !order ? (
        <OrderSkeleton />
      ) : (
        <div className="w-full p-6 rounded-2xl bg-white">
          <div className="flex items-center justify-between">
            <div className="p-0">
              <h1 className="text-2xl font-bold mb-4">Order Details</h1>
              <p className="mb-2">Order #{order.orderNumber}</p>
              <p className="mb-6">Status: {order.orderProgress}</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold mr-4">Change Order Status:</h3>
              <CustomDropdown
                value={order.orderProgress}
                options={Object.values(OrderProgress)}
                onChange={(newStatus) => updateOrderStatus(newStatus)}
                statusUpdating={statusUpdating}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Order Info */}
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Order Info</h2>
              <p className="my-2">
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="my-2">
                <strong>Last Updated:</strong>{" "}
                {new Date(order.updatedAt).toLocaleDateString()}
              </p>
              <p className="my-2">
                <strong>Status:</strong> {order.orderProgress}
              </p>
              <p className="my-2">
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>
              <p className="my-2">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
            </div>

            {/* Customer Info */}
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Customer</h2>
              <p className="my-2">
                <strong>Name:</strong>{" "}
                {`${order.address.firstName} ${order.address.lastName}`}
              </p>
              <p className="my-2">
                <strong>Email:</strong> {order.address.email}
              </p>
              <p className="my-2">
                <strong>Phone:</strong> {order.address.phone}
              </p>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Shipping Address</h2>
              <p className="my-2">
                <strong>City:</strong> {order.address.city}
              </p>
              <p className="my-2">
                <strong>Street:</strong> {order.address.street}
              </p>
              <p className="my-2">
                <strong>House:</strong> {order.address.house}
              </p>
              {order.address.additionalInfo && (
                <p className="my-2">
                  <strong>Additional Info:</strong>{" "}
                  {order.address.additionalInfo}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <Image
                  src={item.product.imageURL1 || "/product/product-02.webp"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                />
                <div className="flex-1 ml-4">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  Ksh{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="text-right">
            <h3 className="text-xl font-bold mt-4">
              Total: Ksh{order.totalAmount.toLocaleString()}
            </h3>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;

const CustomDropdown = ({
  value,
  options,
  onChange,
  statusUpdating,
}: {
  value: OrderProgress;
  options: OrderProgress[];
  onChange: (value: OrderProgress) => void;
  statusUpdating: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: OrderProgress) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleDropdown}
        className="py-3 px-4 rounded-sm bg-[#14AE5C] text-[#FFFFFF] font-semibold flex items-center justify-between w-[220px]"
        disabled={statusUpdating}
      >
        {statusUpdating ? "UPDATING..." : value}
        <svg
          className="w-5 h-5 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden border z-10">
          {options.map((option) => (
            <li
              key={option}
              className="cursor-pointer py-2 px-4 hover:bg-gray-200"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
