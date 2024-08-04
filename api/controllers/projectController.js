// projectController.js
const prisma = require('../../prisma');

exports.createProject = async (req, res) => {
  const { heading, caption, languages, url, date } = req.body;
  const images = req.files.map(file => file.path);

  try {
    const project = await prisma.projects.create({
      data: {
        heading,
        caption,
        languages,
        url,
        date: new Date(date),
        images,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.projects.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { heading, caption, languages, url, date } = req.body;
  const images = req.files ? req.files.map(file => file.path) : null;

  try {
    const updateData = {
      heading,
      caption,
      languages,
      url,
      date: new Date(date),
    };

    if (images) {
      updateData.images = images;
    }

    const project = await prisma.projects.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.projects.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};
