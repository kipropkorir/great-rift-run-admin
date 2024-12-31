"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import Skeleton from "./Skeleton";

interface Blog {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate data loading or fetch your cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await fetch("/api/blogs");
    const data = await response.json();
    setBlogs(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    });
    fetchBlogs();
  };

  return (
    <div className="container mx-auto p-6 ">
      <div className="flex justify-between items-center mb-6 py-4 px-4 rounded-md bg-white">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/blogs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Blog Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-white py-4 px-4 rounded-md">
        {isLoading ? (
          <Skeleton />
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader className="relative">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  height={192}
                  width={250}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-400 hover:bg-red-500"
                  onClick={() => handleDelete(blog.id)}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{blog.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
