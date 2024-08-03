// Import required modules
require('dotenv').config(); // Load environment variables
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
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects_image',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const uploadBlog = multer({ storage: blogStorage });
const uploadProject = multer({ storage: projectStorage });

// Blog Routes
app.post('/api/blogs', uploadBlog.single('image'), async (req, res) => {
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

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

app.put('/api/blogs/:id', uploadBlog.single('image'), async (req, res) => {
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

// Project Routes
app.post('/api/projects', uploadProject.single('image'), async (req, res) => {
  const { heading, caption, languages, url, date } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const project = await prisma.projects.create({
      data: {
        heading,
        caption,
        languages,
        url,
        date: new Date(date),
        image,
      },
    });
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.projects.findMany();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

app.put('/api/projects/:id', uploadProject.single('image'), async (req, res) => {
  const { id } = req.params;
  const { heading, caption, languages, url, date } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const updatedData = {
      heading,
      caption,
      languages,
      url,
      date: new Date(date),
    };

    if (image) {
      updatedData.image = image;
    }

    const project = await prisma.projects.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });
    res.json(project);
  } catch (error) {
    console.error('Error editing project:', error);
    res.status(500).json({ error: 'Error editing project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.projects.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Start the server
const PORT = process.env.PORT || 5801;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
