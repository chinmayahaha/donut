import os
from crewai import Agent, Task, Crew, Process

# ==========================================
# 1. LLM CONFIGURATION
# ==========================================
# Relying on LiteLLM's native string routing for local Ollama.
# Ensure your local Ollama is running and has pulled the model (e.g., `ollama run llama3`).
# If you are using Mistral, change this to "ollama/mistral".
LOCAL_LLM = "ollama/llama3" 

# Optional: If LiteLLM struggles to find the local port automatically, uncomment these:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_API_KEY"] = "sk-11111111111111111111111111111111" # Dummy key required by LiteLLM

# ==========================================
# 2. AGENT DEFINITIONS
# ==========================================
architect = Agent(
    role="Senior MERN Architect",
    goal="Design highly scalable, secure, and robust schemas and API routes for a startup.",
    backstory=(
        "You are a veteran software architect who has scaled multiple startups. "
        "You excel at MongoDB schema design, Express RESTful API structuring, and system design."
    ),
    llm=LOCAL_LLM,
    verbose=True,
    allow_delegation=False
)

ui_specialist = Agent(
    role="UI/UX React Specialist",
    goal="Build responsive, accessible, and performant React components using Tailwind CSS.",
    backstory=(
        "You are a frontend wizard. You breathe React and Tailwind. "
        "Your focus is on clean, modular, and reusable component architecture."
    ),
    llm=LOCAL_LLM,
    verbose=True,
    allow_delegation=False
)

devops_guardian = Agent(
    role="DevOps & Security Guardian",
    goal="Configure zero-downtime CI/CD pipelines, Docker containers, and environment security.",
    backstory=(
        "You are a paranoid but highly effective DevOps engineer. You automate everything via "
        "GitHub Actions and ensure no secrets are ever leaked or hardcoded."
    ),
    llm=LOCAL_LLM,
    verbose=True,
    allow_delegation=False
)

# ==========================================
# 3. TASK DEFINITIONS
# ==========================================
design_task = Task(
    description=(
        "Draft the core MongoDB schemas and Express API endpoints for a standard user "
        "authentication and profile management system."
    ),
    expected_output="A detailed markdown document containing Mongoose schemas and Express route definitions.",
    agent=architect
)

frontend_task = Task(
    description=(
        "Create the React component structure for the login, registration, and user dashboard "
        "pages using Tailwind classes."
    ),
    expected_output="A markdown document with React component code blocks (JSX) and necessary Tailwind classes.",
    agent=ui_specialist
)

deploy_task = Task(
    description=(
        "Write a GitHub Actions deploy.yml workflow to test the code and deploy to Render, "
        "ensuring environment variables are securely referenced."
    ),
    expected_output="A complete deploy.yml file ready for GitHub Actions.",
    agent=devops_guardian
)

# ==========================================
# 4. CREW ASSEMBLY
# ==========================================
startup_crew = Crew(
    agents=[architect, ui_specialist, devops_guardian],
    tasks=[design_task, frontend_task, deploy_task],
    process=Process.sequential,
    verbose=True  # <-- THE FIX: Strict boolean required by Pydantic
)

# ==========================================
# 5. EXECUTION
# ==========================================
if __name__ == "__main__":
    print("Initializing the Autonomous MERN Crew...")
    try:
        # Kickoff the process
        result = startup_crew.kickoff()
        
        print("\n================================================")
        print("CREW EXECUTION COMPLETE")
        print("================================================\n")
        print(result)
        
    except Exception as e:
        print(f"\n[CRITICAL ERROR] Execution failed: {e}")