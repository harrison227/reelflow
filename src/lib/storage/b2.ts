import { S3Client } from '@aws-sdk/client-s3';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env';

export const s3 = new S3Client({
  endpoint: env.B2_ENDPOINT,
  region: env.B2_REGION,
  credentials: {
    accessKeyId: env.B2_ACCESS_KEY_ID,
    secretAccessKey: env.B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export const bucket = env.B2_BUCKET;

export async function presignUpload(params: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: params.expiresInSeconds ?? 3600 });
}

export async function presignDownload(params: {
  key: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: params.key,
  });
  return getSignedUrl(s3, command, { expiresIn: params.expiresInSeconds ?? 3600 });
}

export function buildAssetKey(params: {
  deliverableId: string;
  kind: string;
  version: number;
  filename: string;
}): string {
  const safe = params.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `deliverables/${params.deliverableId}/${params.kind}/v${params.version}/${safe}`;
}
