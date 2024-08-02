const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: 'dlfzhlide',
  api_key: '831974598167488',
  api_secret: 'gH0GKfHlgz0PcpzYN9qjiXPhCYM',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

app.post('/api/blogs', upload.single('image'), async (req, res) => {
  const { heading, title, description, blogURL, date } = req.body;
  const image = req.file.path;

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
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

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
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

const PORT = process.env.PORT || 5801;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
