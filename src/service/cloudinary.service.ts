import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  constructor() {}

  async uploadFile(
    file: Express.Multer.File,
    uploadPreset: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { upload_preset: uploadPreset },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteFileFromPublicId(publicId: string): Promise<boolean> {
    const result = await cloudinary.uploader.destroy(publicId);
    return true;
  }
}
