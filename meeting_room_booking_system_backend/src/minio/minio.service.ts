import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Multer } from 'multer';

@Injectable()
export class MinioService {
  constructor(
    @Inject('MINIO_CLIENT') private readonly minioClient: Minio.Client,
  ) {}

  async getBuckets() {
    return await this.minioClient.listBuckets();
  }

  // 获取所有的存储桶
  presignedPutObject(bucketName: string, name: string) {
    return this.minioClient.presignedPutObject(bucketName, name, 20 * 60 * 60);
  }

  // 将文件上传到指定的存储桶和文件名
  async uploadFile(
    bucketName: string,
    fileName: string,
    file: Express.Multer.File,
  ) {
    await this.minioClient.putObject(bucketName, fileName, file.buffer);

    const expiry = 24 * 60 * 60;

    const presignedUrl = await this.minioClient.presignedUrl(
      'GET',
      bucketName,
      fileName,
      expiry,
    );

    return {
      url: presignedUrl,
    };
  }

  async deleteFile(bucketName: string, fileName: string) {
    return await this.minioClient.removeObject(bucketName, fileName);
  }

  // 生成一个预签名的 PUT URL，允许用户在指定的时间（默认 24 小时）内上传文件到指定的存储桶和文件名位置。
  async presignedPutUrl(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    return await this.minioClient.presignedPutObject(
      bucketName,
      fileName,
      expiry,
    );
  }

  // 生成一个预签名的 GET URL，允许用户在指定的时间（默认 24 小时）内从指定的存储桶下载文件。
  async presignedGetUrl(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    return await this.minioClient.presignedGetObject(
      bucketName,
      fileName,
      expiry,
    );
  }

  // 创建一个预签名的 POST 策略。这个策略定义了通过 HTTP POST 方法上传文件的规则。
  async presignedPostPolicy(
    bucketName: string,
    fileName: string,
    expiry: number = 24 * 60 * 60,
  ) {
    const policy = new Minio.PostPolicy();

    policy.setBucket(bucketName);
    policy.setKey(fileName);
    policy.setExpires(new Date(new Date().getTime() + expiry * 1000));

    return await this.minioClient.presignedPostPolicy(policy);
  }
}
