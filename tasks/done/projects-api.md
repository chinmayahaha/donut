# Projects API Routes

**Agent**: backend
**Priority**: high
**Output**: server/routes/projects.js

## Objective
Build Express.js CRUD routes for the Projects collection.

## Requirements
- GET /api/projects — get all projects for logged in user, sorted by date
- POST /api/projects — create new project, body: title, description, status, tags
- GET /api/projects/:id — get single project, only owner can access
- PUT /api/projects/:id — update project, only owner can update
- DELETE /api/projects/:id — delete project, only owner can delete
- All routes require JWT auth middleware
- Use JWT_ACCESS_SECRET from environment variables
- Import Project from ../models/Project
- Use try/catch on all routes
- Return consistent error format
