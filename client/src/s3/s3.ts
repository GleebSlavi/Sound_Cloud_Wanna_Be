import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID ?? "default",
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ?? "default"
  },
})