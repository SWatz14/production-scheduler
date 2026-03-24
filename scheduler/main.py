# This is the main entry point for the Production Scheduler API built with FastAPI.
# It sets up the FastAPI application, configures CORS middleware to allow cross-origin requests,
# and includes the scheduling router which contains all the endpoints related to scheduling operations.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import schedule
import uvicorn

app = FastAPI(
    title="Production Scheduling Engine",
    description="EDD and SPT scheduling algorithms",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schedule.router, prefix="/api", tags=["scheduling"])

@app.get("/health")
def health():
    return {"status": "Scheduling engine is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)