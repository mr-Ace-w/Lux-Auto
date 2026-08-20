import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.R2_BUCKET_NAME || 'lux-auto-media';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId!,
    secretAccessKey: r2SecretAccessKey!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ success: true });
    }

    const keys = urls
      .map((url: string) => {
        if (url.includes('.r2.dev/')) {
          return url.split('.r2.dev/')[1];
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (keys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: r2Bucket,
          Delete: {
            Objects: keys.map(Key => ({ Key })),
          },
        })
      );
    }

    return NextResponse.json({ success: true, deleted: keys.length });
  } catch (err: any) {
    console.warn('R2 delete error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
