"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !thumbnail) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/blogs');
      } else {
        throw new Error('Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Failed to create blog post');
    }
  };

  return (
    <div className="container mx-auto">
      <Card className='border-0'>
        <CardHeader className='bg-white rounded-md p-6 mb-6'>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent className='bg-white rounded-md p-6'>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here..."
                className="min-h-[300px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail</label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {preview ? (
                  <div className="relative">
                    <Image
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setThumbnail(null);
                        setPreview('');
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <ImagePlus className="h-12 w-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Click to upload thumbnail
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className='hover:bg-gray-400 hover:text-white'
                onClick={() => router.push('/blogs')}
              >
                Cancel
              </Button>
              <Button type="submit" className='hover:bg-green-600 hover:text-white'>Create Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}