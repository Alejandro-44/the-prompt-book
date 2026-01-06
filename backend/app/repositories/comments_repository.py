from pymongo.collection import Collection
from bson import ObjectId

from app.schemas import Comment

class CommentsRepository:

    def __init__(self, database):
        self.__collection: Collection[Comment] = database["comments"]

    async def get_by_prompt(self, prompt_id: ObjectId):
        pipeline = [
            {
                "$match": {
                    "prompt_id": prompt_id
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            { "$unwind": "$user" },
            {
                "$project": {
                    "_id": 1,
                    "content": 1,
                    "prompt_id": 1,
                    "pub_date": 1,
                    "user_id": 1,
                    "author": "$user.username" 
                }
            },
            {
                "$sort": {
                    "pub_date": -1
                }
            }
        ]
        cursor = await self.__collection.aggregate(pipeline)
        return await cursor.to_list()

    async def create(self, comment_data: dict) -> str:
        result = await self.__collection.insert_one(comment_data)
        return str(result.inserted_id)

    async def update(self, comment_id: ObjectId, user_id: ObjectId, comment_data: dict) -> bool:
        result = await self.__collection.update_one({ "_id": comment_id, "user_id": user_id }, { "$set": comment_data }) 
        return result.modified_count > 0

    async def delete(self, comment_id: ObjectId, user_id: ObjectId) -> bool:
        result = await self.__collection.delete_one({ "_id": comment_id, "user_id": user_id })
        return result.deleted_count > 0
 