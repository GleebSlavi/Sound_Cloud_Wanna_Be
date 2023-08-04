import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

export const s3 = new S3Client({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ?? ""
  },
});

export const getKeyFromS3Uri = (uri: string): string | null => {
  const parts = uri?.split("/");
  if (parts?.length >= 4) {
    return parts.slice(3).join("/");
  }
  return null;
}

export const uploadFileToS3 = async (file: File, bucket: string | undefined, 
  existingKey: string | null): Promise<string> => {
  try{
    const key = existingKey || nanoid(32);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file
    });

    await s3.send(command);
    return `https://${bucket}.s3.${process.env.REACT_APP_AWS_BUCKET_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    alert("Couldn't upload the file! Please try again!");
    return "";
  }
}

export const deleteFileFromS3 = async (key: string, bucket: string | undefined) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })

    await s3.send(command);
  } catch (error) {
    alert("Couldn't delete the file! Please try again!");
  }
}