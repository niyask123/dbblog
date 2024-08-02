// Import required modules
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

// Initialize Express app and Prisma client
const app = express();
const prisma = new PrismaClient();

// Middleware setup
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

// Create a new blog post
app.post('/api/blogs', upload.single('image'), async (req, res) => {
  const { heading, title, description, blogURL, date } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const blog = await prisma.blog.create({
      data: {
        heading,
        title,
        description,
        blogURL,
        date: new Date(date),
        image,
      },
    });
    res.json(blog);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// Get all blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// Edit a blog post
app.put('/api/blogs/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { heading, title, description, blogURL, date } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const updatedData = {
      heading,
      title,
      description,
      blogURL,
      date: new Date(date),
    };

    if (image) {
      updatedData.image = image;
    }

    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });
    res.json(blog);
  } catch (error) {
    console.error('Error editing blog post:', error);
    res.status(500).json({ error: 'Error editing blog post' });
  }
});

// Delete a blog post
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

// Start the server
const PORT = process.env.PORT || 5801;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
