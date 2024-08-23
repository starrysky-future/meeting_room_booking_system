import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import * as multer from 'multer';
import * as fs from 'fs';

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync('uploads');
    } catch (e) {}

    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, uniqueSuffix);
  },
});
