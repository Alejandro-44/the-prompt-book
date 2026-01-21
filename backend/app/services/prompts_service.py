import math
from datetime import datetime, timezone

from bson import ObjectId

from app.repositories import PromptsRepository, LikesRepository
from app.schemas import PromptCreate, PromptUpdate, Prompt, PromptSummary, User
from app.core.exceptions import PromptNotFoundError, DatabaseError, PromptOwnershipError
from app.utils import extract_hashtags


class PromptsService:
    def __init__(self, prompts_repo: PromptsRepository, likes_repo: LikesRepository):
        self.__prompts_repo = prompts_repo
        self.__likes_repo = likes_repo

    async def _validate_prompt_ownership(
        self,
        prompt_id: str,
        user_id: str
    ) -> None:
        prompt = await self.get_one(prompt_id)
        if prompt.author_id != str(user_id):
            raise PromptOwnershipError()

    def process_prompt_documents(self, prompt_documents) -> list[PromptSummary]:
        return [PromptSummary.from_document(document) for document in prompt_documents]

    async def get_summary(self, filters: dict, page: int, limit: int) -> list[PromptSummary]:
        skip = (page - 1) * limit

        if filters.get("liked_by"):
            liked_ids = list(await self.__likes_repo.get_prompt_ids_by_user(filters.get("liked_by")))
            filters["liked_ids"] = liked_ids

        items, total = await self.__prompts_repo.get_summary(
            filters,
            skip,
            limit
        )

        return {
            "items": self.process_prompt_documents(items),
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit) if total > 0 else 0
        }
    
    async def get_one(self, prompt_id: ObjectId, user: User | None = None) -> Prompt:
        prompt_document = await self.__prompts_repo.get_one(prompt_id)

        if not prompt_document:
            raise PromptNotFoundError()

        prompt = Prompt.from_document(prompt_document)

        liked_ids = set()
        if user:
            liked_ids = set(await self.__likes_repo.get_prompt_ids_by_user(ObjectId(user.id)))

        prompt.like_by_me = prompt_id in liked_ids

        return prompt


    async def create(self, user: User, prompt: PromptCreate):
        prompt_data = prompt.model_dump()
        hashtags = extract_hashtags(prompt.description)
        prompt_data.update({
            "author_id": ObjectId(user.id),
            "author_name": user.username,
            "author_handle": user.handle,
            "hashtags": hashtags,
            "likes_count": 0,
            "pub_date": datetime.now(timezone.utc)
        })

        try:
            inserted_id = await self.__prompts_repo.create(prompt_data)
        except Exception as exc:
            raise DatabaseError() from exc

        return inserted_id

    async def update(self, prompt_id: ObjectId, user_id: ObjectId, update_data: PromptUpdate):
        await self._validate_prompt_ownership(prompt_id, user_id)

        new_data = update_data.model_dump(exclude_unset=True)
        try:            
            await self.__prompts_repo.update(prompt_id, new_data)    
        except Exception as exc:
            raise DatabaseError() from exc
        
        return True

    async def delete(self, prompt_id: ObjectId, user_id: ObjectId):
        await self._validate_prompt_ownership(prompt_id, user_id)

        try:
            await self.__prompts_repo.delete(prompt_id)
        except Exception as exc:
            raise DatabaseError() from exc

        return True
