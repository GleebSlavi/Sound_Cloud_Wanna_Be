import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

export const s3 = new S3Client({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ?? ""
  },
});

export const  getKeyFromS3Uri = (uri: string): string | null => {
  const parts = uri.split("/");
  if (parts.length >= 4) {
    return parts.slice(3).join("/");
  }
  return null;
}

export const uploadFileToS3 = async (file: File, bucket: string | undefined, 
  setUrl: (value: string) => void, existingKey: string | null) => {
  try{
    const key = existingKey || nanoid(32);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file
    });

    await s3.send(command);
    existingKey || setUrl(`https://${bucket}.s3.${process.env.REACT_APP_AWS_BUCKET_REGION}.amazonaws.com/${key}`);
  } catch (error) {
    console.log(error);
    alert("Couldn't upload the file! Please try again!");
  }
}