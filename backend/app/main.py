"""FastAPI application entry point."""

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.agreements import router as agreements_router
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    description="AI-Powered Covenant Logic Compiler for LMA Loan Agreements",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": settings.app_name, "version": "1.0.0"}


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Covenant Logic Compiler API",
        "docs": "/docs",
        "health": "/health",
    }


app.include_router(agreements_router, prefix="/api/v1/agreements", tags=["Agreements"])


@app.on_event("startup")
async def startup_event():
    """Server startup handler."""
    print(f"🚀 {settings.app_name} is starting...")
    print("📄 API docs available at: http://localhost:8000/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Server shutdown handler."""
    print(f"👋 {settings.app_name} is shutting down...")
