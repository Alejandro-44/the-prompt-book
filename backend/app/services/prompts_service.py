import math
from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId

from app.repositories.prompts_repository import PromptsRepository
from app.schemas.prompt_schema import PromptCreate, PromptUpdate, Prompt, PromptSummary
from app.core.exceptions import PromptNotFoundError, DatabaseError

class PromptsService:

    def __init__(self, prompts_repo: PromptsRepository):
        self.__prompts_repo = prompts_repo

    def process_prompt_documents(self, prompt_documents) -> list[PromptSummary]:
        return [PromptSummary.from_document(document) for document in prompt_documents]

    async def get_summary(self, filters: dict, page: int, limit: int) -> list[PromptSummary]:
        skip = (page - 1) * limit

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
    
    async def get_by_id(self, prompt_id: str) -> Prompt | PromptNotFoundError:
        prompt_document = None
        try:
            prompt_document = await self.__prompts_repo.get_by_id(prompt_id)
        except InvalidId:
            raise PromptNotFoundError()

        if not prompt_document:
            raise PromptNotFoundError()

        return Prompt.from_document(prompt_document[0])

    async def create(self, user_id: str, prompt_in: PromptCreate):
        prompt_data = prompt_in.model_dump()
        prompt_data.update({
            "user_id": ObjectId(user_id),
            "pub_date": datetime.now()
        })

        try:
            inserted_id = await self.__prompts_repo.create(prompt_data)
        except:
            raise DatabaseError()

        return inserted_id

    async def update(self, prompt_id: str, user_id: str, update_data: PromptUpdate):
        new_data = update_data.model_dump(exclude_unset=True)
        try:
            updated = await self.__prompts_repo.update(prompt_id, user_id, new_data)
        except:
            raise DatabaseError()

        if not updated:
            raise PromptNotFoundError()

        return True

    async def delete(self, prompt_id: str, user_id: str):
        try:
            deleted = await self.__prompts_repo.delete(prompt_id, user_id)
        except:
            raise DatabaseError()

        if not deleted:
            raise PromptNotFoundError()

        return True
