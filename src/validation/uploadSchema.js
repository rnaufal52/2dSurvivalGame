import multer from 'multer';

const upload = multer({
    limits: {
        fileSize: 2 * 1024 * 1024, // Maximum file size: 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/json'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            const error = new multer.MulterError('Invalid file type. Only JSON files are allowed.');
            error.status = 400;
            cb(error);
        }
    },
});

export default upload;
