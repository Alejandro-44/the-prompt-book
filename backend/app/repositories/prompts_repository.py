from pymongo.collection import Collection
from bson.objectid import ObjectId

from app.schemas.prompt_schema import Prompt


class PromptsRepository:
    def __init__(self, database):
        self.__collection: Collection[Prompt] = database["prompts"]

    async def get_summary(
        self, 
        filters: dict,
        skip: int,
        limit: int
    ) -> list[Prompt]:
        mongo_filters = {}

        if filters:
            if filters.get("author_id"):
                mongo_filters["author_id"] = filters["author_id"]

            if filters.get("author_handle"):
                mongo_filters["author_handle"] = filters["author_handle"]

            if filters.get("hashtags"):
                mongo_filters["hashtags"] = {"$in": filters["hashtags"]}

            if filters.get("model"):
                mongo_filters["model"] = filters["model"]

        total = await self.__collection.count_documents(mongo_filters)

        pipeline = [
            {"$match": mongo_filters},
            {"$sort": {"pub_date": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "description": 1,
                    "hashtags": 1,
                    "model": 1,
                    "pub_date": 1,
                    "author_name": 1,
                    "author_handle": 1,
                    "likes_count": 1
                }
            }
        ]
            
        cursor = await self.__collection.aggregate(pipeline)
        items = await cursor.to_list()

        return items, total

    async def get_one(self, prompt_id: ObjectId) -> Prompt | None:
        return await self.__collection.find_one({"_id": prompt_id})

    async def create(self, prompt_data: dict) -> str:
        result = await self.__collection.insert_one(prompt_data)
        return str(result.inserted_id)

    async def update(self, prompt_id: ObjectId, update_data: dict) -> bool:
        result = await self.__collection.update_one({ "_id": prompt_id }, { "$set": update_data  })
        return result.modified_count > 0

    async def delete(self, prompt_id: ObjectId) -> bool:
        result = await self.__collection.delete_one({ "_id": prompt_id })
        return result.deleted_count > 0
 
    async def increment_likes(self, prompt_id, delta: int):
        await self.__collection.update_one(
            {"_id": prompt_id},
            {"$inc": {"likes_count": delta}},
        )
