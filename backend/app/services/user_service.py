from datetime import datetime, timezone

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.schemas.user_schema import UserCreate, User
from app.core.security import hash_password
from app.repositories.user_repository import UserRepository
from app.core.exceptions import (
    UserNotFoundError,
    UserAlreadyExistsError,
    DatabaseError,
)
from app.utils import generate_handle

MAX_HANDLE_RETRIES = 3

class UserService:
    def __init__(self, user_repo: UserRepository):
        self._user_repo = user_repo
    
    async def get_one(self, filters: dict) -> User:
        user_document = await self._user_repo.get_one(filters)
        if not user_document:
            raise UserNotFoundError
        
        user = User.from_document(user_document)
        if not user.is_active:
            return User(
                id=user.id,
                username="deleted user",
                handle="deleted",
                is_active=False
            )
        
        return user
    
    async def _user_handle_exists(self, handle: str):
        document = await self._user_repo.get_one({ "handle": handle })
        return document != None

    async def register_user(self, user: UserCreate) -> User:
        email = user.email.strip().lower()
        existing = await self._user_repo.get_one({ "email": email, "is_active": True })   
        if existing:
            raise UserAlreadyExistsError()
    
        new_user = {
            "username": user.username,
            "email": email,
            "hashed_password": hash_password(user.password),
            "is_active": True,
            "handle_locked": False,
            "created_at": datetime.now(timezone.utc),
        }

        for attempt in range(MAX_HANDLE_RETRIES):
            try:
                handle = await generate_handle(
                    username=user.username,
                    exists_fn=self._user_handle_exists,
                )

                new_user["handle"] = handle

                new_user_id = await self._user_repo.create(new_user)

                return User(
                    id=new_user_id,
                    username=new_user["username"],
                    handle=new_user["handle"],
                    is_active=new_user["is_active"],
                )

            except DuplicateKeyError:
                if attempt == MAX_HANDLE_RETRIES - 1:
                    raise UserAlreadyExistsError()
                continue
            except Exception as exc:
                raise DatabaseError() from exc
        
    
    async def deactivate(self, user_id: ObjectId) -> bool:
        deactivated = await self._user_repo.update(user_id, { "is_active": False })
        if not deactivated:
            raise DatabaseError("Failed to deactivate user")
        return deactivated
