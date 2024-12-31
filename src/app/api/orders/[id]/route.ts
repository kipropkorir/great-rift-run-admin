import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt((await params).id),
      },
      include: {
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageURL1: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: {
        id: parseInt((await params).id),
      },
      data: {
        orderProgress: body.status,
      },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}