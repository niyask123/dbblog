const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dlfzhlide',
  api_key: '831974598167488',
  api_secret: 'gH0GKfHlgz0PcpzYN9qjiXPhCYM',
});

module.exports = cloudinary;
