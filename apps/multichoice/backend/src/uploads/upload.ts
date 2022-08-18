import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import configuration from '../config/configuration';

// Multer configuration
export const multerConfig = {
    dest: configuration().upload_location,
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: +configuration().max_file_size,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {

        if (file.fieldname.match(/image/g) && file.mimetype.match(/\/(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            // Allow storage of file
            cb(null, true);
        } else if (file.fieldname.match(/audio/g) && file.mimetype.match(/\/(|mpeg)$/)) {
            cb(null, true);
        }
        else {
            // Reject file
            cb(new HttpException(`${file.fieldname} : Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.dest;

            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    }),
};

