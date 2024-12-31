import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the base upload directory for blogs
const uploadDir = path.join(process.cwd(), 'public', 'images', 'blogs');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function saveBlogImage(file: Buffer, originalFilename: string): Promise<string> {
  // Generate unique filename
  const extension = path.extname(originalFilename);
  const filename = `${uuidv4()}${extension}`;
  
  // Save file to disk
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file);
  
  // Return the relative URL
  return `/images/blogs/${filename}`;
}