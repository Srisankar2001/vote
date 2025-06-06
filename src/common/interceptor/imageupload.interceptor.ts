import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UseInterceptors } from '@nestjs/common';

export function UploadImageInterceptor() {
  return UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `./uploads`,
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }));
}
