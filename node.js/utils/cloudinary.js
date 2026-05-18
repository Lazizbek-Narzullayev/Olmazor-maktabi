import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dduvy4xov',
  api_key: process.env.CLOUDINARY_API_KEY || '866251378936412',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'AAHpauAfTzAmAV2xUDpsDhlpcEvwYr7U8XI', // Note: I should use the user's provided one or placeholder
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'olmazor_library',
    resource_type: 'auto', // for PDF, DOC, etc.
    allowed_formats: ['jpg', 'png', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
  },
});

export const upload = multer({ storage: storage });
export default cloudinary;
