# # backend/main.py
# from contextlib import asynccontextmanager
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from backend.api.main import api_router
# # 👇 UPDATE: 'Base' aur 'engine' ko yahan se hata diya hai
# from backend.core.db import create_db_and_tables

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Create tables on startup
#     create_db_and_tables()
#     yield

# app = FastAPI(title="Todo Web App API", version="0.1.0", lifespan=lifespan)

# # 👇 NUCLEAR CORS SETUP (Sab allow)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],     # Sab allowed
#     allow_credentials=False, # Credentials band
#     allow_methods=["*"],     # Sab methods allowed
#     allow_headers=["*"],     # Sab headers allowed
# )

# app.include_router(api_router, prefix="/api/v1")

# @app.get("/health")
# def health_check():
#     return {"status": "ok"}

# if __name__ == "__main__":
#     import uvicorn
#     # Host 0.0.0.0 zaroori hai Windows localhost issue ke liye
#     uvicorn.run(app, host="0.0.0.0", port=8000)










# backend/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.main import api_router
from core.db import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    create_db_and_tables()
    yield

app = FastAPI(title="Todo Web App API", version="0.1.0", lifespan=lifespan)

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)