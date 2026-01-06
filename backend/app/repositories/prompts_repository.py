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
            if filters.get("user_id"):
                mongo_filters["user_id"] = ObjectId(filters["user_id"])

            if filters.get("tags"):
                mongo_filters["tags"] = {"$in": filters["tags"]}

            if filters.get("model"):
                mongo_filters["model"] = filters["model"]

        total = await self.__collection.count_documents(mongo_filters)

        pipeline = [
            {"$match": mongo_filters},
            {"$sort": {"pub_date": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "tags": 1,
                    "model": 1,
                    "pub_date": 1,
                    "author_id": "$author._id",
                    "author_name": "$author.username"
                }
            }
        ]
            
        cursor = await self.__collection.aggregate(pipeline)
        items = await cursor.to_list()

        return items, total

    async def get_one(self, prompt_id: ObjectId) -> Prompt | None:
        pipeline = [
            {
                "$match": {
                    "_id": prompt_id
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            {"$unwind": "$author"},
            {"$limit": 1}
        ]

        cursor = await self.__collection.aggregate(pipeline)
        results = await cursor.to_list()

        return results[0] if results else None

    async def create(self, prompt_data: dict) -> str:
        result = await self.__collection.insert_one(prompt_data)
        return str(result.inserted_id)

    async def update(self, prompt_id: ObjectId, update_data: dict) -> bool:
        result = await self.__collection.update_one({ "_id": prompt_id }, { "$set": update_data  })
        return result.modified_count > 0

    async def delete(self, prompt_id: ObjectId) -> bool:
        result = await self.__collection.delete_one({ "_id": prompt_id })
        return result.deleted_count > 0
 