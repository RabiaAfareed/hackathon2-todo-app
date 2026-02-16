import asyncio
import os
import sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run():
    # File ka absolute path nikalna zaroori hai
    current_dir = os.path.dirname(os.path.abspath(__file__))
    server_script = os.path.join(current_dir, "mcp-server", "main.py")

    print(f"Starting MCP server at: {server_script}")

    # 'uv' ki jagah direct 'python' use karein
    server_params = StdioServerParameters(
        command=sys.executable, # Ye current python ka path khud dhoond lega
        args=[server_script],
        env=os.environ.copy()
    )

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                print("Initializing session...")
                await session.initialize()
                
                print("Fetching tools...")
                tools = await session.list_tools()
                print("Available tools:", [tool.name for tool in tools.tools])
                
    except Exception as e:
        print(f"\n[ERROR]: {e}")

if __name__ == "__main__":
    asyncio.run(run())