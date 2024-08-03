const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    format: async (req, file) => 'png', 
    public_id: (req, file) => file.filename,
  },
});

const upload = multer({ storage: storage });

module.exports = upload.single('image');
