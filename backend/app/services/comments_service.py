from math import ceil

from datetime import datetime, timezone

from bson import ObjectId

from app.schemas import CommentCreate, CommentUpdate, Comment, User, PaginatedResponse
from app.repositories.comments_repository import CommentsRepository
from app.core.exceptions import CommentNotFoundError, DatabaseError

class CommentsService:
    def __init__(self, comments_repo: CommentsRepository):
        self._comments_repo = comments_repo

    async def get_prompt_comments(self, prompt_id: ObjectId, page: int, limit: int) -> PaginatedResponse[Comment]:
        skip = (page - 1) * limit
        comments = []
        total = 0
        try:
            comments_docs, total = await self._comments_repo.get_by_prompt(prompt_id, skip, limit)
        except:
            raise DatabaseError
        
        comments = [Comment.from_document(document) for document in comments_docs]

        return {
            "items": comments,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": ceil(total / limit) if total > 0 else 0
        }

    async def create(self, prompt_id: ObjectId, user: User, comment_in: CommentCreate) -> str:
        comment_data = comment_in.model_dump()
        try:
            comment_data.update({
                "prompt_id": prompt_id,
                "author_id": ObjectId(user.id),
                "author_name": user.username,
                "author_handle": user.handle,
                "pub_date": datetime.now(timezone.utc),
            })
        except Exception as exc:
            raise DatabaseError() from exc
        
        try:
            return await self._comments_repo.create(comment_data)
        except Exception:
            raise DatabaseError()

    async def update(self, comment_id: ObjectId, user_id: ObjectId, update_data: CommentUpdate) -> bool:
        new_data = update_data.model_dump(exclude_unset=True)
        updated = await self._comments_repo.update(comment_id, user_id, new_data)
        if not updated:
            raise CommentNotFoundError()
        return updated

    async def delete(self, comment_id: ObjectId, author_id: ObjectId) -> bool:
        deleted = await self._comments_repo.delete(comment_id, author_id)
        if not deleted:
            raise CommentNotFoundError()
        return deleted
    
    async def update_author_data(self, author_id: ObjectId, new_name: str=None, new_handle: str=None):
        updated = False
        try:
            updated = await self._comments_repo.update_author_data(
                author_id,
                new_name,
                new_handle
            )
        except Exception as exc:
            raise DatabaseError() from exc

        return updated
