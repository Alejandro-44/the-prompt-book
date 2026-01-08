from pymongo.collection import Collection
from bson import ObjectId

from app.schemas import Comment

class CommentsRepository:

    def __init__(self, database):
        self.__collection: Collection[Comment] = database["comments"]

    async def get_by_prompt(self, prompt_id: ObjectId):
        cursor = (self.__collection
            .find({"prompt_id": prompt_id})
            .sort("pub_date", -1)
        )

        return await cursor.to_list()

    async def create(self, comment_data: dict) -> str:
        result = await self.__collection.insert_one(comment_data)
        return str(result.inserted_id)

    async def update(self, comment_id: ObjectId, author_id: ObjectId, comment_data: dict) -> bool:
        result = await self.__collection.update_one({ "_id": comment_id, "author_id": author_id }, { "$set": comment_data }) 
        return result.modified_count > 0

    async def delete(self, comment_id: ObjectId, author_id: ObjectId) -> bool:
        result = await self.__collection.delete_one({ "_id": comment_id, "author_id": author_id })
        return result.deleted_count > 0
 