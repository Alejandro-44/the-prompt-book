from typing import Optional
from bson import ObjectId
from pymongo.collection import Collection

from app.schemas.user_schema import User
from app.core.types import PyObjectId

class UserRepository:
    def __init__(self, database):
        self.__collection: Collection[User] = database["users"]

    async def create(self, user_data: User) -> str:
        result = await self.__collection.insert_one(user_data)
        return str(result.inserted_id)
    
    async def get_one(self, filters: dict) -> User | None:
        mongo_filters = {}
        if filters:
            if filters.get("id"):
                mongo_filters["_id"] = filters["id"]

            if filters.get("email"):
                mongo_filters["email"] = filters["email"]

            if filters.get("is_active"):
                mongo_filters["is_active"] = filters["is_active"]
        
        return await self.__collection.find_one(mongo_filters)

    async def update(self, user_id: PyObjectId, update_data: dict) -> bool:
        result = await self.__collection.update_one(
            {"_id": user_id},
            {"$set": update_data},
        )
        return result.modified_count > 0
