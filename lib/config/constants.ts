export const SPACES_BASE_URL = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com`;

export const IMAGE_FOLDERS = {
  PRODUCTS: 'products',
  BLOGS: 'blogs'
} as const;