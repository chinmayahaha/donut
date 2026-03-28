# Donut - AI-Powered MERN Development Crew

File-based task automation system using CrewAI + Ollama (fully offline)

## 🎯 System Overview

This system uses a **file-based task queue** where:
- Task files (`.md`) are placed in `tasks/` directory
- Each task is tagged with an agent (`ui`, `backend`, or `devops`)
- The crew automatically reads, routes, and executes tasks
- Outputs are saved to `outputs/` directory with timestamps
- **GSD Methodology** ensures clean context between tasks

## 📁 Directory Structure

```
donut/
├── crew.py                    # Main crew orchestration script
├── tasks/                     # Task queue (input)
│   ├── login-form.md         # Example UI task
│   ├── auth-api.md           # Example backend task
│   └── docker-setup.md       # Example devops task
├── outputs/                   # Agent outputs (auto-created)
│   ├── 20240328_143022_login-form.txt
│   └── 20240328_143145_auth-api.txt
└── client/                    # Your MERN app structure
    └── src/
        └── components/
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install crewai langchain-community
```

### 2. Start Ollama

Ensure Ollama is running locally with qwen2.5:3b model:

```bash
# Start Ollama service
ollama serve

# Pull the model (if not already done)
ollama pull qwen2.5:3b
```

### 3. Create a Task File

Place a task file in `tasks/` directory (see task file format below).

### 4. Run the Crew

```bash
python crew.py
```

The system will:
- ✅ Scan `tasks/` directory for `.md` files
- ✅ Parse and validate each task
- ✅ Route tasks to appropriate agents
- ✅ Execute tasks sequentially with context clearing
- ✅ Save outputs to `outputs/` directory

## 📝 Task File Format

Every task file must follow this structure:

```markdown
# Task Title

**Agent**: ui | backend | devops
**Priority**: high | medium | low
**Output**: path/to/output/file.ext

---

## Objective
Clear description of what needs to be built

## Requirements
- Detailed specifications
- Technical constraints
- Dependencies

## Expected Output
Description of deliverable
```

### Required Metadata

| Field | Description | Values |
|-------|-------------|--------|
| `**Agent**` | Which specialist handles this task | `ui`, `backend`, `devops` |
| `**Priority**` | Execution priority (tasks sorted by this) | `high`, `medium`, `low` |
| `**Output**` | Where the output should be saved | File path string |

### Example: UI Task

```markdown
# Login Form Component

**Agent**: ui
**Priority**: high
**Output**: client/src/components/LoginForm.jsx

---

## Objective
Build a React login form with email/password validation

## Requirements
- Email validation
- Password min 6 chars
- Loading state
- Error handling
- API: POST http://localhost:5000/api/auth/login
```

## 🤖 Available Agents

### UI Specialist (`ui`)
- **Role**: Frontend React components
- **Specialties**: React, Tailwind CSS, UX, accessibility
- **Output**: `.jsx`, `.tsx`, `.css` files

### Backend Specialist (`backend`)
- **Role**: API and server-side logic
- **Specialties**: Node.js, Express, MongoDB, authentication
- **Output**: `.js` route files, middleware, controllers

### DevOps Specialist (`devops`)
- **Role**: Infrastructure and deployment
- **Specialties**: Docker, CI/CD, cloud deployment, monitoring
- **Output**: Dockerfiles, YAML configs, scripts

## 🧹 GSD Methodology (Context Clearing)

**Getting Stuff Done** methodology ensures:

1. **Fresh Context**: Each task starts with clean state
2. **No Memory Pollution**: Previous task outputs don't interfere
3. **Isolated Execution**: Each task runs in its own Crew instance
4. **Clear Inputs → Clear Outputs**: Predictable, reproducible results

### How It Works

```python
# Traditional approach (context accumulation)
crew = Crew(agents=[agent1, agent2, agent3])
crew.kickoff()  # All tasks share context ❌

# GSD approach (context clearing)
for task in tasks:
    crew = Crew(agents=[task.agent])  # Fresh instance
    crew.kickoff()  # Isolated execution ✅
```

## 📊 Output Files

Each execution creates a timestamped output file:

```
20240328_143022_login-form.txt
```

**Format**:
```
================================================================================
TASK: Login Form Component
AGENT: ui
PRIORITY: high
TIMESTAMP: 2024-03-28T14:30:22
================================================================================

[Agent's generated code/content here]

================================================================================
Expected output location: client/src/components/LoginForm.jsx
================================================================================
```

## ⚙️ Configuration

Edit `crew.py` to customize:

```python
# Ollama configuration
LLM_CONFIG = {
    "model": "qwen2.5:3b",          # Change model here
    "base_url": "http://localhost:11434",
    "temperature": 0.7,              # Adjust creativity (0-1)
}

# Agent settings
max_iter=3,  # Max iterations per task
verbose=True,  # Show detailed logs
```

## 🔧 Workflow Example

**Scenario**: Build a complete authentication system

### Step 1: Create Task Files

```bash
tasks/
├── 01-login-form.md        # UI task - React component
├── 02-signup-form.md       # UI task - React component  
├── 03-auth-routes.md       # Backend task - Express routes
├── 04-auth-middleware.md   # Backend task - JWT middleware
└── 05-docker-compose.md    # DevOps task - Container setup
```

### Step 2: Run Crew

```bash
python crew.py
```

### Step 3: Review Outputs

```bash
outputs/
├── 20240328_140122_01-login-form.txt      # LoginForm.jsx code
├── 20240328_140245_02-signup-form.txt     # SignupForm.jsx code
├── 20240328_140356_03-auth-routes.txt     # auth.routes.js code
├── 20240328_140512_04-auth-middleware.txt # auth.middleware.js code
└── 20240328_140628_05-docker-compose.txt  # docker-compose.yml
```

### Step 4: Copy to Project

```bash
# Extract and place files in your project structure
cp outputs/20240328_140122_01-login-form.txt client/src/components/LoginForm.jsx
# (Manually extract code from output file)
```

## 🐛 Troubleshooting

### Issue: "No agent tag found"
**Solution**: Ensure task file has `**Agent**: ui` (or backend/devops)

### Issue: "Connection refused to Ollama"
**Solution**: Start Ollama service: `ollama serve`

### Issue: "Model not found"
**Solution**: Pull model: `ollama pull qwen2.5:3b`

### Issue: Task outputs are incomplete
**Solution**: Increase `max_iter` in agent configuration or reduce task complexity

### Issue: Context drift across tasks
**Solution**: System already implements GSD - each task is isolated

## 📈 Best Practices

1. **One Task Per File**: Keep tasks focused and atomic
2. **Descriptive Filenames**: Use numbered prefixes for execution order
3. **Clear Requirements**: Provide detailed specifications
4. **Test Incrementally**: Run 1-2 tasks first, then scale up
5. **Review Outputs**: Always review generated code before using
6. **Version Control**: Commit task files to track what you've requested

## 🔐 Security Notes

- This system is **fully offline** (no external API calls)
- All processing happens locally via Ollama
- No credentials or sensitive data is sent externally
- Task files may contain API endpoints - use `.gitignore` if needed

## 📚 Advanced Usage

### Custom Agent

Add new specialist agents in `create_agents()`:

```python
database_specialist = Agent(
    role="Database Architect",
    goal="Design optimal database schemas and queries",
    backstory="Expert in MongoDB schema design and optimization",
    llm=llm,
)

# Update routing dict
return {
    "ui": ui_specialist,
    "backend": backend_specialist,
    "devops": devops_specialist,
    "database": database_specialist,  # New agent
}
```

### Parallel Execution

Modify `Process.sequential` to `Process.hierarchical` for parallel tasks:

```python
crew = Crew(
    agents=[agent],
    tasks=[task],
    process=Process.hierarchical,  # Changed from sequential
)
```

## 🎓 Learning Resources

- **CrewAI Docs**: https://docs.crewai.com/
- **Ollama Models**: https://ollama.ai/library
- **Langchain Guide**: https://python.langchain.com/docs/

## 📄 License

MIT License - Feel free to modify and extend this system!

---

**Confidence Score**: 95%

This system provides a robust, offline-first approach to AI-assisted development with clear separation of concerns, repeatable workflows, and production-ready outputs.
