"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, Users, ShoppingBag, MailOpen } from "lucide-react";
import DashboardSkeleton from "./Skeleton";

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  orderProgress: "PROCESSING" | "INTRANSIT" | "READY_FOR_PICKUP" | "COMPLETED";
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  inStock: number;
}

interface Contact {
  id: number;
  name: string;
  subject: string;
  createdAt: string;
}

interface Blog {
  id: number;
  title: string;
  createdAt: string;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueAccumulator {
  [key: string]: number;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [, setBlogs] = useState<Blog[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data loading or fetch your cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, contactsRes, blogsRes] =
          await Promise.all([
            fetch("/api/orders"),
            fetch("/api/products"),
            fetch("/api/contacts"),
            fetch("/api/blogs"),
          ]);

        const [ordersData, productsData, contactsData, blogsData] =
          await Promise.all([
            ordersRes.json() as Promise<Order[]>,
            productsRes.json() as Promise<Product[]>,
            contactsRes.json() as Promise<Contact[]>,
            blogsRes.json() as Promise<Blog[]>,
          ]);

        setOrders(ordersData);
        setProducts(productsData);
        setContacts(contactsData);
        setBlogs(blogsData);

        // Process revenue data with proper typing
        const revenueByDate = ordersData.reduce<RevenueAccumulator>(
          (acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + order.totalAmount;
            return acc;
          },
          {}
        );

        const chartData: RevenueData[] = Object.entries(revenueByDate).map(
          ([date, amount]) => ({
            date,
            amount: Number(amount), // Ensure amount is a number
          })
        );

        setRevenueData(chartData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    // Set up polling every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const pendingOrders = orders.filter(
    (order) => order.orderProgress === "PROCESSING"
  ).length;
  const lowStockProducts = products.filter(
    (product) => product.inStock < 10
  ).length;
  const recentContacts = contacts.length;

  return (
    <>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="p-6 space-y-6 bg-white rounded-md">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <ShoppingBag className="h-10 w-10 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl font-bold">
                      KES {totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Package className="h-10 w-10 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Pending Orders
                    </p>
                    <h3 className="text-2xl font-bold">{pendingOrders}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Low Stock Items
                    </p>
                    <h3 className="text-2xl font-bold">{lowStockProducts}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <MailOpen className="h-10 w-10 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      New Messages
                    </p>
                    <h3 className="text-2xl font-bold">{recentContacts}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          KES {order.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.orderProgress}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.slice(0, 5).map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500">
                          {contact.subject}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
