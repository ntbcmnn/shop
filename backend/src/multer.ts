import multer from 'multer';
import path from 'path';
import fs from 'node:fs';

const rootDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, {recursive: true});
}

export function createUploader(subfolder = '') {
    const destDir = path.join(rootDir, subfolder);
    fs.mkdirSync(destDir, {recursive: true});

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, destDir),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
    });

    return multer({storage, limits: {fileSize: 5 * 1024 * 1024}});
}
