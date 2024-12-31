import { PutObjectCommand } from "@aws-sdk/client-s3";
import { spacesClient } from "../lib/spaces-client";
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: Buffer, originalFilename: string, folder: 'products' | 'blogs'): Promise<string> {
  const extension = originalFilename.split('.').pop();
  const filename = `${uuidv4()}.${extension}`;
  const key = `${folder}/${filename}`;

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key,
      Body: file,
      ACL: "public-read",
      ContentType: `image/${extension}`
    })
  );

  return `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`;
}