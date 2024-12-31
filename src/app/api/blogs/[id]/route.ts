import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt((await params).id), // Parse the ID to integer
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await prisma.blog.delete({
      where: {
        id: parseInt((await params).id), // Parse the ID to integer
      },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
