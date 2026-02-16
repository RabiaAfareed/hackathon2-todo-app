import os
import sys
from dotenv import load_dotenv
# Sahi libraries jo aapki pyproject.toml mein hain
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

load_dotenv()

# 1. Path ko sahi (Absolute) banayein
current_dir = os.path.dirname(os.path.abspath(__file__))
mcp_script_path = os.path.abspath(os.path.join(current_dir, "..", "mcp-server", "main.py"))

# 2. Server parameters ko dictionary format mein rakhein (jaisa openai-agents ko chahiye)
server_params = {
    "command": sys.executable,
    "args": [mcp_script_path],
    "env": os.environ.copy()
}

# 3. MCP Server initialize karein
mcp_server = MCPServerStdio(server_params, client_session_timeout_seconds=30)

def create_todo_agent():
    return Agent(
        name="TodoAgent",
        instructions="""
        You are a helpful productivity assistant. 
        You help users manage tasks using tools.
        Always use the session_token provided in the context.
        """,
        mcp_servers=[mcp_server],
        model="gpt-4o-mini"
    )

async def chat_with_agent(message: str, agent: Agent):
    # Context manager lazmi hai MCP connect karne ke liye
    async with mcp_server:
        result = await Runner.run(agent, message)
        return result.final_output