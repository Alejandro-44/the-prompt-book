from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "The Prompt Book API"
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "thepromptbook"
    JWT_SECRET: str = "supersecret" 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o]


settings = Settings()

if __name__ == "__main__":
    print(settings.model_dump())
