import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { OrderProgress } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const orders = await prisma.order.findMany({
      where: status && status !== 'ALL' ? {
        orderProgress: status as OrderProgress
      } : undefined,
      include: {
        address: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}