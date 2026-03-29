# Projects Page Component

**Agent**: ui
**Priority**: high
**Output**: client/src/components/ProjectsPage.jsx

## Objective
Build a production-ready React Projects page using Tailwind CSS. Users can view, create, and delete their projects.

## Requirements

### Layout
- Same sidebar as Dashboard (copy the sidebar structure)
- Main content area with Projects heading
- Create Project button in top right of content area

### Project List
- Fetch projects from GET https://donut-wd2v.onrender.com/api/projects
- Send JWT token from localStorage in Authorization header: Bearer token
- Display projects in a grid of cards (3 columns on desktop, 1 on mobile)
- Each card shows: title, description, status badge, created date
- Status badge colors: planning=gray, active=green, on-hold=yellow, completed=blue, archived=red
- Empty state: "No projects yet. Create your first one."
- Loading state while fetching

### Create Project Modal
- Button opens a modal form
- Fields: Title (required), Description (optional), Status (select: planning/active/on-hold/completed/archived)
- Submit calls POST https://donut-wd2v.onrender.com/api/projects with Bearer token
- On success close modal and refresh project list
- On error show error message inside modal

### Delete Project
- Each card has a Delete button
- Calls DELETE https://donut-wd2v.onrender.com/api/projects/:id with Bearer token
- On success remove from list

### Auth
- Read token from localStorage
- If no token redirect to /

### Dependencies
- react-router-dom (installed)
- axios (installed)

### Styling
- Tailwind CSS only
- No inline styles
- Functional component with hooks
- Default export
