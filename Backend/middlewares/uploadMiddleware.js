import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Лимит 5MB
  fileFilter: (_req, file, callback) => {
    const allowedFileTypes = [
      "image/svg",
      "image/svg+xml",
      "image/webp",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true); // Файл принят
    } else {
      callback(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only JPEG and PNG images are allowed!"
        )
      );
    }
  },
});

export default upload;
