from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers.api import router
import os

app = FastAPI(
    title="Leylek API",
    description="Meaning-based Tatar name discovery platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Serve frontend static files if they exist
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "frontend-dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React frontend for any non-API routes"""
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        # For client-side routing, return index.html for all other paths
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))


@app.on_event("startup")
async def startup_event():
    from services.xml_parser import parser_service
    parser_service.load_all()
    print("Leylek API started. XML data loaded into memory.")
