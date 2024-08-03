const prisma = require('../../prisma');

// Create a new blog post
exports.createBlog = async (req, res) => {
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
    res.status(500).json({ error: 'Error creating blog post' });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
};

// Edit a blog post
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { heading, title, description, blogURL, date } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const updateData = {
      heading,
      title,
      description,
      blogURL,
      date: new Date(date),
    };

    if (image) {
      updateData.image = image;
    }

    const blog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Error editing blog post' });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting blog post' });
  }
};
