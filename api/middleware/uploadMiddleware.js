const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinaryConfig');

// Storage for blog images
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.filename,
  },
});

// Storage for project images
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects_image',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.filename,
  },
});

const blogUpload = multer({ storage: blogStorage });
const projectUpload = multer({ storage: projectStorage });

module.exports = {
  blogSingle: blogUpload.single('image'),
  blogOptional: () => (req, res, next) => {
    if (req.method === 'PUT' && !req.file) {
      return next();
    }
    blogUpload.single('image')(req, res, next);
  },
  projectSingle: projectUpload.single('image'),
  projectMultiple: projectUpload.array('images', 10), // Adjust the number as needed
};
