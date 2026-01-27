from pymongo.collection import Collection
from bson import ObjectId

from app.schemas import Comment

class CommentsRepository:

    def __init__(self, database):
        self.__collection: Collection[Comment] = database["comments"]

    async def get_by_prompt(
            self,
            prompt_id: ObjectId,
            skip: int,
            limit: int
        ) -> tuple[list[Comment], int]:
        total = await self.__collection.count_documents({"prompt_id": prompt_id})

        cursor = (
            self.__collection
            .find({"prompt_id": prompt_id})
            .skip(skip)
            .limit(limit)
            .sort("pub_date", -1)
        )

        items = await cursor.to_list()

        return items, total

    async def create(self, comment_data: dict) -> str:
        result = await self.__collection.insert_one(comment_data)
        return str(result.inserted_id)

    async def update(self, comment_id: ObjectId, author_id: ObjectId, comment_data: dict) -> bool:
        result = await self.__collection.update_one({ "_id": comment_id, "author_id": author_id }, { "$set": comment_data }) 
        return result.modified_count > 0

    async def delete(self, comment_id: ObjectId, author_id: ObjectId) -> bool:
        result = await self.__collection.delete_one({ "_id": comment_id, "author_id": author_id })
        return result.deleted_count > 0
 
    async def update_author_data(self, author_id: ObjectId, new_name: str=None, new_handle: str=None):
        update_fields = {}
        if new_name is not None:
            update_fields["author_name"] = new_name
        if new_handle is not None:
            update_fields["author_handle"] = new_handle

        updated = await self.__collection.update_many(
            {"author_id": author_id},
            {
                "$set": update_fields
            }
        )

        return updated.modified_count > 0
