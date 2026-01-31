from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Prompt Book API"
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "thepromptbook"
    JWT_SECRET: str = "supersecret" 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENV: str = "dev"
    CORS_ORIGINS: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o]

    @property
    def is_prod(self) -> bool:
        return self.ENV == "prod"


settings = Settings()

if __name__ == "__main__":
    print(settings.model_dump())
