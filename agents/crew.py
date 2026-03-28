"""
Donut - AI-Powered MERN Development Crew
File-based task management system with dynamic agent routing
"""

import os
import re
import time
from pathlib import Path
from datetime import datetime
from crewai import Agent, Task, Crew, Process


# ============================================================================
# CONFIGURATION
# ============================================================================

BASE_DIR = Path(__file__).parent.parent  # points to C:\Users\chait\donut
TASKS_DIR = BASE_DIR / "tasks"
OUTPUTS_DIR = BASE_DIR / "outputs"

# Ensure directories exist
TASKS_DIR.mkdir(exist_ok=True)
OUTPUTS_DIR.mkdir(exist_ok=True)

# Model string — CrewAI routes to Ollama directly, no LangChain object needed
MODEL = "ollama/qwen2.5-coder:7b"

# ============================================================================
# AGENT DEFINITIONS
# ============================================================================

def create_agents():
    """Initialize all specialist agents"""

    ui_specialist = Agent(
        role="UI/Frontend Specialist",
        goal="Build production-ready React components with excellent UX and accessibility",
        backstory="""You are an expert frontend developer specializing in React and Tailwind CSS.
        You create clean, accessible, and performant UI components that follow best practices.
        You pay attention to edge cases, error handling, and user experience details.""",
        llm=MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=3,
    )

    backend_specialist = Agent(
        role="Backend/API Specialist",
        goal="Design and implement robust, secure backend APIs and services",
        backstory="""You are a senior backend engineer with expertise in Node.js, Express, and MongoDB.
        You build secure, scalable APIs with proper error handling, validation, and authentication.
        You follow REST principles and implement comprehensive error handling.""",
        llm=MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=3,
    )

    devops_specialist = Agent(
        role="DevOps/Infrastructure Specialist",
        goal="Automate deployment, manage infrastructure, and ensure system reliability",
        backstory="""You are a DevOps engineer who specializes in CI/CD and cloud infrastructure.
        You create automated deployment pipelines and optimize application performance.
        You focus on security, scalability, and monitoring.""",
        llm=MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=3,
    )

    return {
        "ui": ui_specialist,
        "backend": backend_specialist,
        "devops": devops_specialist,
    }

# ============================================================================
# TASK FILE PARSING
# ============================================================================

def parse_task_file(filepath):
    """Parse task file and extract metadata"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        agent_match = re.search(r'\*\*Agent\*\*:\s*(\w+)', content)
        priority_match = re.search(r'\*\*Priority\*\*:\s*(\w+)', content)
        output_match = re.search(r'\*\*Output\*\*:\s*(.+)', content)
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)

        if not agent_match:
            raise ValueError(f"No agent tag found in {filepath.name}")

        return {
            'agent': agent_match.group(1).lower(),
            'priority': priority_match.group(1).lower() if priority_match else 'medium',
            'output_path': output_match.group(1).strip() if output_match else None,
            'title': title_match.group(1).strip() if title_match else filepath.stem,
            'content': content,
            'filename': filepath.name,
        }

    except Exception as e:
        print(f"❌ Error parsing {filepath.name}: {e}")
        return None

def load_task_files():
    """Load and parse all task files from tasks/ directory"""
    task_files = sorted(TASKS_DIR.glob("*.md"))

    if not task_files:
        print("⚠️  No task files found in tasks/ directory")
        return []

    tasks = []
    for filepath in task_files:
        parsed = parse_task_file(filepath)
        if parsed:
            tasks.append(parsed)

    priority_order = {'high': 0, 'medium': 1, 'low': 2}
    tasks.sort(key=lambda x: priority_order.get(x['priority'], 3))

    return tasks

# ============================================================================
# OUTPUT MANAGEMENT
# ============================================================================

def save_output(task_info, agent_output):
    """Save agent output to file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{task_info['filename'].replace('.md', '.txt')}"
    output_path = OUTPUTS_DIR / filename

    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write(f"TASK: {task_info['title']}\n")
            f.write(f"AGENT: {task_info['agent']}\n")
            f.write(f"PRIORITY: {task_info['priority']}\n")
            f.write(f"TIMESTAMP: {datetime.now().isoformat()}\n")
            f.write("=" * 80 + "\n\n")
            f.write(str(agent_output))
            f.write("\n\n" + "=" * 80 + "\n")
            f.write(f"Expected output location: {task_info['output_path']}\n")
            f.write("=" * 80 + "\n")

        print(f"✅ Output saved: {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ Error saving output: {e}")
        return None

# ============================================================================
# TASK EXECUTION — GSD METHODOLOGY
# ============================================================================

def execute_task(task_info, agents):
    """
    Execute a single task with context clearing (GSD methodology)
    Each task gets its own fresh Crew instance — no context pollution
    """
    agent_tag = task_info['agent']

    if agent_tag not in agents:
        print(f"❌ Unknown agent tag: {agent_tag}")
        return None

    agent = agents[agent_tag]

    task = Task(
        description=task_info['content'],
        agent=agent,
        expected_output=(
            f"Complete implementation as specified. Save to: {task_info['output_path']}"
            if task_info['output_path']
            else "Complete implementation as specified"
        ),
    )

    # Fresh Crew per task — GSD context clearing
    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    print(f"\n{'='*80}")
    print(f"🚀 EXECUTING: {task_info['title']}")
    print(f"👤 AGENT: {agent_tag}  |  ⚡ PRIORITY: {task_info['priority']}")
    print(f"{'='*80}\n")

    try:
        result = crew.kickoff()
        output_path = save_output(task_info, str(result))
        print(f"\n✅ Task completed: {task_info['title']}\n")
        return {
            'task': task_info['title'],
            'agent': agent_tag,
            'result': result,
            'output_file': output_path,
        }

    except Exception as e:
        print(f"\n❌ Task failed: {task_info['title']}")
        print(f"Error: {e}\n")
        return {
            'task': task_info['title'],
            'agent': agent_tag,
            'error': str(e),
        }

# ============================================================================
# MAIN
# ============================================================================

def run_crew():
    print("\n" + "="*80)
    print("🍩 DONUT - AI-Powered MERN Development Crew")
    print("="*80 + "\n")

    print("📂 Loading task files...")
    tasks = load_task_files()

    if not tasks:
        print("\n⚠️  No tasks to execute. Add .md files to the tasks/ directory.\n")
        return

    print(f"✅ Found {len(tasks)} task(s)\n")
    print("📋 Task Queue:")
    for i, task in enumerate(tasks, 1):
        print(f"  {i}. [{task['agent'].upper()}] {task['title']} (Priority: {task['priority']})")
    print()

    print("🤖 Initializing agents...")
    agents = create_agents()
    print(f"✅ {len(agents)} agent(s) ready\n")

    results = []
    for i, task_info in enumerate(tasks, 1):
        print(f"\n{'─'*80}")
        print(f"Task {i}/{len(tasks)}")
        print(f"{'─'*80}")
        result = execute_task(task_info, agents)
        results.append(result)
        time.sleep(2)  # brief pause between tasks for stability

    print("\n" + "="*80)
    print("📊 EXECUTION SUMMARY")
    print("="*80 + "\n")

    successful = [r for r in results if r and 'error' not in r]
    failed = [r for r in results if r and 'error' in r]

    print(f"✅ Successful: {len(successful)}")
    print(f"❌ Failed: {len(failed)}")

    if successful:
        print("\n✅ Completed Tasks:")
        for r in successful:
            print(f"  • {r['task']} → {r['output_file'].name if r['output_file'] else 'No output'}")

    if failed:
        print("\n❌ Failed Tasks:")
        for r in failed:
            print(f"  • {r['task']}: {r['error']}")

    print(f"\n📁 Outputs saved to: {OUTPUTS_DIR.absolute()}\n")


if __name__ == "__main__":
    run_crew()
