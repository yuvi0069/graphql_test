import bcrypt from "bcrypt";
import { NoParametersError } from "../../errors";
import {  getUserRoleIdByName, insertUser } from "../models/db";
import {admin,bucket} from '../config/firebaseadmin'
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// import { Worker, Job } from "bullmq";
// import redis from "../redis/redis";

// export const imageUploadWorker = new Worker("imageUpload", async (job: Job) => {
//   const { userUuid, filename, buffer } = job.data; // Receive the buffer

//   console.log(`Processing image for user ${userUuid}: ${filename}`);
//   const jsonString = JSON.stringify(buffer);
//   const bufferFromObject = Buffer.from(jsonString);
//   // Upload the buffer directly to Firebase
//   console.log(typeof(bufferFromObject))
//   if (!Buffer.isBuffer(bufferFromObject)) {
//     throw new TypeError("Expected buffer to be of type Buffer");
//   }
//   const imageUrl = await saveImageToFirebase1(bufferFromObject, filename); // Update this function to handle buffer
//   console.log(imageUrl);
//   return imageUrl;
// }, {
//   connection: redis,
// });

// // Handle errors
// imageUploadWorker.on("failed", (job, err) => {
//   console.error(`Job ${job.id} failed:`, err);
// });

// export const saveImageLocally = async (stream: NodeJS.ReadableStream, filename: string) => {
//   const uniqueFilename = `${Date.now()}-${filename}`;
//   const filePath = path.join(uploadDir, uniqueFilename);
//   const out = fs.createWriteStream(filePath);

//   return new Promise<any>((resolve, reject) => {
//     stream
//       .pipe(out)
//       .on('finish', () => resolve(`/uploads/${filename}`))
//       .on('error', (error) => reject(`Error saving file: ${error.message}`));
//   });
// };
export const saveImageToFirebase1 = async (buffer: Buffer, filename: string) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`images/${filename}`);
 
  // Upload the buffer directly
  await file.save(buffer, {
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  // Get the signed URL for the uploaded file
  const url = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
  });

  return url[0]; // Return the signed URL
};

export const saveImageToFirebase = async (stream:NodeJS.ReadableStream, filename:string) => {
  const file = bucket.file(`images/${filename}`);

  return new Promise((resolve, reject) => {
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'image/jpeg'
      }
    });

    stream.pipe(writeStream)
      .on('finish', async () => {
      
        const url = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10 
        });
        resolve(url[0]);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const bcryptPassword = async (password: string):Promise<String> => {
  if (!password) {
    throw new NoParametersError("NO PASSWORD");
  }
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: any, hash: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNo: string;
  role: string;
}

export async function createUserClient(data: RegisterData,otp:number) {
  const encryptPassword = await bcryptPassword(data.password);
  const roleId = await getUserRoleIdByName(data.role);
  const clients = await insertUser(data, otp,encryptPassword.toString(), roleId);
  return {
    userId: clients.id,
    userUuid: clients.uuid,
  };
}
