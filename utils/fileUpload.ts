// utils/fileUpload.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the base upload directory
const uploadDir = path.join(process.cwd(), 'public', 'products', 'images');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function saveImage(file: Buffer, originalFilename: string): Promise<string> {
  // Generate unique filename
  const extension = path.extname(originalFilename);
  const filename = `${uuidv4()}${extension}`;
  
  // Save file to disk
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file);
  
  
  // Return the full URL
  return `/products/images/${filename}`;
}