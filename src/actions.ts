import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const user = {
  name: "Tajwar",
};

const AWS_BUCKET_NAME = "your-bucket-name"; // Replace with your actual bucket name
const AWS_BUCKET_REGION = "your-bucket-region"; // Replace with your actual bucket region
const AWS_ACCESS_KEY = "your-access-key"; // Replace with your actual access key
const AWS_SECRET_ACCESS_KEY = "your-secret-access-key"; // Replace with your actual secret access key

const s3 = new S3Client({
  region: AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function getSignedURL(
  size: number,
  type: string,
  checksum: string
) {
  try {
    if (!user) {
      return {
        success: false,
        url: "",
        message: "Not Authenticated",
      };
    }

    const randomKey = Math.random().toString(36).substring(2, 15);
    const putObjectCommand = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: randomKey,
      ContentType: type,
      ContentLength: size,
      ChecksumSHA256: checksum,
      Metadata: {
        usename: user.name,
        checksum,
      },
    });

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60,
    });

    return {
      success: true,
      url: signedURL,
      message: "Signed URL",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      url: "",
      message: "Something went wrong!",
    };
  }
}

export async function getAllFiles() {
  try {
    const listCommand = new ListObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
    });

    const response = await s3.send(listCommand);

    if (!response.Contents) {
      return {
        success: true,
        files: [],
        message: "No files found",
      };
    }

    const files = response.Contents.map((object) => ({
      key: object.Key,
      lastModified: object.LastModified,
      size: object.Size,
      url: `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${object.Key}`,
      type: object.ChecksumType,
    }));

    return {
      success: true,
      files,
      message: "Files retrieved successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      files: [],
      message: "Failed to retrieve files",
    };
  }
}

export async function deleteFile(fileName: string) {
  try {
    const file = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    });

    await s3.send(file);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to retrieve files",
    };
  }
}
