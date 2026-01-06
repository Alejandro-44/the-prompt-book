import math
from datetime import datetime

from app.repositories.prompts_repository import PromptsRepository
from app.schemas.prompt_schema import PromptCreate, PromptUpdate, Prompt, PromptSummary
from app.core.exceptions import PromptNotFoundError, DatabaseError, PromptOwnershipError
from app.core.types import PyObjectId

class PromptsService:
    def __init__(self, prompts_repo: PromptsRepository):
        self.__prompts_repo = prompts_repo

    async def _validate_prompt_ownership(
        self,
        prompt_id: str,
        user_id: str
    ) -> None:
        prompt = await self.get_one(prompt_id)
        if prompt.author.id != str(user_id):
            raise PromptOwnershipError()

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
    
    async def get_one(self, prompt_id: PyObjectId) -> Prompt:
        prompt_document = await self.__prompts_repo.get_one(prompt_id)

        if not prompt_document:
            raise PromptNotFoundError()

        return Prompt.from_document(prompt_document)

    async def create(self, user_id: PyObjectId, prompt_in: PromptCreate):
        prompt_data = prompt_in.model_dump()
        prompt_data.update({
            "user_id": user_id,
            "pub_date": datetime.now()
        })

        try:
            inserted_id = await self.__prompts_repo.create(prompt_data)
        except Exception as exc:
            raise DatabaseError() from exc

        return inserted_id

    async def update(self, prompt_id: PyObjectId, user_id: PyObjectId, update_data: PromptUpdate):
        await self._validate_prompt_ownership(prompt_id, user_id)

        new_data = update_data.model_dump(exclude_unset=True)
        try:            
            await self.__prompts_repo.update(prompt_id, new_data)    
        except Exception as exc:
            raise DatabaseError() from exc
        
        return True

    async def delete(self, prompt_id: PyObjectId, user_id: PyObjectId):
        await self._validate_prompt_ownership(prompt_id, user_id)

        try:
            await self.__prompts_repo.delete(prompt_id)
        except Exception as exc:
            raise DatabaseError() from exc

        return True
