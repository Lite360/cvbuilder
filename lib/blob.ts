import { put } from '@vercel/blob';

export async function uploadToBlob(filename: string, content: Buffer | Blob | ReadableStream, contentType?: string): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  const blob = await put(filename, content, {
    access: 'public',
    contentType,
    token,
  });

  return blob.url;
}
