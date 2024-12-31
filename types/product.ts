export type Product = {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  color?: string;
  material?: string;
  imageURL1?: string;
  imageURL2?: string;
  imageURL3?: string;
  imageURL4?: string;
  createdAt: Date;
};