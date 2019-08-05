declare const process;

// Global Environment Variables
export const port = process.env.PORT || 3000;
export const env = process.env.NODE_ENV || 'development';
export const testing = process.env['LOADED_MOCHA_OPTS'];

export const sessionSecret = process.env.SESSION_SECRET || 'fullyannotated';
export const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/fullyannotated';
export const cors = process.env.CORS_URL || 'origin';
export const logging = process.env.LOGGING || 1;
export const cwd = process.cwd();


export const FileStorage = process.env.FS_TYPE || 'fs'; // set as fs for local and IPFS for the IPFS server
export const IPFS = process.env.IPFS_URL || ''; // The primary IPFS url.

// Multer Configuration
import * as multer from 'multer';

export const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './upload');
    },
    filename(req, file, cb) {
        const name = String(Number(new Date())) + '-' + file.originalname;
        cb(null, name);
    }
});

export const upload = multer({ storage });

export async function processFile(path) {
    return new Promise((resolve, reject) => {
        if (FileStorage === 'ipfs') {
            return resolve(`upload/${path}`);
        } else {
            return resolve(`upload/${path}`);
        }
    });
}
