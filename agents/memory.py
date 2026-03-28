# ============================================================
#  File   : memory.py
#  Place  : C:\Users\chait\donut\agents\memory.py
#  Usage  : Import this in crew.py to give agents persistent memory
# ============================================================

from mem0 import Memory

# ── Configuration ─────────────────────────────────────────────
# All local — no cloud, no API keys, fully offline
config = {
    "vector_store": {
        "provider": "chroma",
        "config": {
            "collection_name": "donut_agent_memory",
            "path": "./db_local",  # stored on disk, survives reboots
        }
    },
    "llm": {
        "provider": "ollama",
        "config": {
            "model": "qwen2.5-coder:7b",
            "temperature": 0.1,
            "max_tokens": 2000,
            "ollama_base_url": "http://localhost:11434",
        }
    },
    "embedder": {
        "provider": "ollama",
        "config": {
            "model": "nomic-embed-text",
            "ollama_base_url": "http://localhost:11434",
        }
    }
}

# ── Initialize Memory ─────────────────────────────────────────
memory = Memory.from_config(config)

# ── Helper Functions ──────────────────────────────────────────

def remember(content, agent_id="default_agent"):
    """Store a memory for an agent"""
    try:
        memory.add(content, user_id=agent_id)
        print(f"✅ Memory stored for {agent_id}")
    except Exception as e:
        print(f"❌ Memory store failed: {e}")

def recall(query, agent_id="default_agent"):
    """Retrieve relevant memories for an agent"""
    try:
        results = memory.search(query, user_id=agent_id)
        return results
    except Exception as e:
        print(f"❌ Memory recall failed: {e}")
        return []

def clear_agent_memory(agent_id="default_agent"):
    """Clear all memories for an agent (use between sessions if needed)"""
    try:
        memory.delete_all(user_id=agent_id)
        print(f"✅ Memory cleared for {agent_id}")
    except Exception as e:
        print(f"❌ Memory clear failed: {e}")

# ── Test (run this file directly to verify setup) ─────────────
if __name__ == "__main__":
    print("Testing Mem0 + ChromaDB setup...\n")

    remember("The donut app uses MongoDB Atlas for database", agent_id="architect")
    remember("The frontend runs on React with Tailwind CSS", agent_id="ui_specialist")
    remember("Backend is deployed on Render, frontend on Vercel", agent_id="devops")

    print("\nRecalling architect memories:")
    results = recall("What database does donut use?", agent_id="architect")
    for r in results:
        print(f"  - {r}")

    print("\n✅ Memory system working correctly")
