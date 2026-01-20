from bson import ObjectId
from pymongo.collection import Collection

from app.schemas import Like

class LikesRepository:
    def __init__(self, database):
        self.__collection: Collection[Like] = database["likes"]

    async def create(self, like: Like, session=None) -> Like:
        result = await self.__collection.insert_one(like, session=session)
        return str(result.inserted_id)

    async def delete(self, prompt_id: ObjectId, user_id: ObjectId) -> None:
        result = await self.__collection.delete_one(
            { "prompt_id": prompt_id, "user_id": user_id}
        )
        return result.deleted_count > 0

    async def get_prompt_ids_by_user(self, user_id: ObjectId) -> list[ObjectId]:
        return await self.__collection.distinct(
            "prompt_id",
            {"user_id": user_id},
        )
