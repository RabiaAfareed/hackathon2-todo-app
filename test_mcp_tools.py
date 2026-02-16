# test_mcp_tools.py
import asyncio
import os
# Hum mcp client use karenge bina AI agent ke
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Tumhara Session Token (Jo humne generate kiya tha)
SESSION_TOKEN = "3978c8a4-3b48-4366-a908-f49b22710d13"

async def run_test():
    print("🚀 Starting MCP Server connection...")
    
    # Ye wahi logic hai jo Agent use karta hai server connect karne ke liye
    server_params = StdioServerParameters(
        command="uv",
        args=["run", "mcp-server/main.py"],
        env=os.environ.copy()
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 1. Initialize Connection
            await session.initialize()
            print("✅ MCP Server Connected!")

            # 2. List Tools (Check karo tools available hain ya nahi)
            tools = await session.list_tools()
            print(f"\n🛠 Available Tools: {[tool.name for tool in tools.tools]}")

            # 3. Test: Create Task
            print("\nTesting: create_task...")
            try:
                result_create = await session.call_tool(
                    "create_task",
                    arguments={
                        "session_token": SESSION_TOKEN,
                        "title": "Manual Test Task",
                        "description": "Checking if MCP connects to Backend"
                    }
                )
                print(f"📄 Create Result: {result_create.content}")
            except Exception as e:
                print(f"❌ Create Task Failed: {e}")

            # 4. Test: Get Tasks
            print("\nTesting: get_tasks...")
            try:
                result_get = await session.call_tool(
                    "get_tasks",
                    arguments={"session_token": SESSION_TOKEN}
                )
                print(f"📋 Task List: {result_get.content}")
            except Exception as e:
                print(f"❌ Get Tasks Failed: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())