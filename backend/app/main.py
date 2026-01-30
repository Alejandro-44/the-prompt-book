from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient

from app.routes import auth_routes, user_routes, prompt_routes
from app.core.config import settings
from app.core.db import create_indexes

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        client = AsyncMongoClient(settings.MONGO_URI)
        database = client.get_database(settings.MONGO_DB)

        # Guardar en app.state
        app.state.client = client
        app.state.database = database

        pong = await database.command("ping")
        if int(pong["ok"]) != 1:
            raise Exception("Cluster connection is not okay!")
        
        await create_indexes(database)

        yield

        await client.close()
    except Exception as e:
        print("Error connecting to the database:", e)
        raise e


app = FastAPI(lifespan=lifespan, title=settings.PROJECT_NAME)


origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

if settings.CORS_ORIGINS:
    origins += settings.cors_origins_list

print(origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(prompt_routes.router)
