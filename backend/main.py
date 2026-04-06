from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.api import router

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


@app.get("/")
async def root():
    return {"status": "ok", "message": "Leylek API is running"}


@app.on_event("startup")
async def startup_event():
    from services.xml_parser import parser_service
    parser_service.load_all()
    print("Leylek API started. XML data loaded into memory.")
