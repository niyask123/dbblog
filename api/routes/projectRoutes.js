const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Create a new project
router.post('/', uploadMiddleware.projectMultiple, projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

// Edit a project (images are optional)
router.put('/:id', uploadMiddleware.projectMultiple, projectController.updateProject);

// Delete a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
