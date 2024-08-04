const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Create a new blog post
router.post('/', uploadMiddleware.blogSingle, blogController.createBlog);

// Get all blog posts
router.get('/', blogController.getAllBlogs);

// Edit a blog post (image is optional)
router.put('/:id', uploadMiddleware.blogOptional(), blogController.updateBlog);

// Delete a blog post
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
