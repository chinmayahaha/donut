// ============================================================
//  File   : projects.js
//  Place  : C:\Users\chait\donut\server\routes\projects.js
// ============================================================

const express = require('express');

const Project = require('../models/Project');

const router = express.Router();

const auth = require('../middleware/auth');

// ── GET /api/projects ─────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ── POST /api/projects ────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, tags, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const project = await Project.create({
      title,
      description,
      status,
      tags,
      dueDate,
      owner: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
console.error('Project create error:', err.message);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// ── GET /api/projects/:id ─────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ── PUT /api/projects/:id ─────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });

    const { title, description, status, tags, dueDate } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (tags) project.tags = tags;
    if (dueDate) project.dueDate = dueDate;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ── DELETE /api/projects/:id ──────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
