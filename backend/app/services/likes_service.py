from datetime import datetime

from pymongo.errors import DuplicateKeyError
from bson import ObjectId

from app.repositories import LikesRepository, PromptsRepository
from app.core.exceptions import AlreadyLikedError, LikeNotFoundError

class LikesService:
    def __init__(self, likes_repo: LikesRepository, prompts_repo: PromptsRepository):
        self.__likes_repo = likes_repo
        self.__prompts_repo = prompts_repo

    async def like_prompt(self, prompt_id: ObjectId, user_id: ObjectId):
        try:
            await self.__likes_repo.create(
                {
                    "prompt_id": prompt_id,
                    "user_id": user_id,
                    "created_at": datetime.now(),
                }
            )
            await self.__prompts_repo.increment_likes(prompt_id, +1)
        except DuplicateKeyError:
            raise AlreadyLikedError()
        

    async def unlike_prompt(self, prompt_id, user_id):
        deleted = await self.__likes_repo.delete(prompt_id, user_id)
        if deleted:
            await self.__prompts_repo.increment_likes(prompt_id, -1)
        else:
            raise LikeNotFoundError()
