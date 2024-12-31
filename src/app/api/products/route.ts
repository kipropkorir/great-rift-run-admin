import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadImage } from '../../../../utils/imageUpload';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const productData = {
      category: formData.get('category') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      inStock: parseInt(formData.get('inStock') as string),
      color: formData.get('color') as string,
      material: formData.get('material') as string,
    };

    // Validate required fields
    const missingFields = [];
    if (!productData.name) missingFields.push('name');
    if (!productData.category) missingFields.push('category');
    if (isNaN(productData.price)) missingFields.push('price');
    if (isNaN(productData.inStock)) missingFields.push('inStock');
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        missingFields
      }, { status: 400 });
    }

    // Handle image uploads
    const imageUrls = [];
    for (let i = 0; i < 4; i++) {
      const imageFile = formData.get(`image${i}`) as File | null;
      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const imageUrl = await uploadImage(buffer, imageFile.name, 'products');
        imageUrls.push(imageUrl);
      }
    }

    // Save product to database
    const product = await prisma.product.create({
      data: {
        ...productData,
        imageURL1: imageUrls[0] || null,
        imageURL2: imageUrls[1] || null,
        imageURL3: imageUrls[2] || null,
        imageURL4: imageUrls[3] || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({
      error: 'Failed to save product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
      const products = await prisma.product.findMany({
          orderBy: {
              createdAt: 'desc'
          },
          where: {
              deletedAt: null
          }
      });
      
      return NextResponse.json(products);
  } catch (error) {
      console.error('Failed to fetch products:', error);
      return NextResponse.json(
          { error: 'Failed to fetch products' },
          { status: 500 }
      );
  } finally {
      await prisma.$disconnect();
  }
}