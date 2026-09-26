import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CarbonLens 360 API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    CLIMATIQ_API_KEY: str = os.getenv("CLIMATIQ_API_KEY", "")
    SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    OCR_API_KEY: str = os.getenv("OCR_API_KEY", "")
    ROUTING_API_KEY: str = os.getenv("ROUTING_API_KEY", "")

settings = Settings()
