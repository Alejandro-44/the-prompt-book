from typing import Optional
from bson.errors import InvalidId

from app.schemas.user_schema import UserCreate, User
from app.core.security import hash_password
from app.repositories.user_repository import UserRepository
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError, DatabaseError

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.__user_repo = user_repo
    
    async def get_by_email(self, email: str) -> Optional[User]:
        user = await self.__user_repo.get_by_email(email)
        if not user:
            return None
        return User.from_document(user)

    async def get_by_id(self, user_id: str) -> User | Exception:
        user_doc = None
        try:
            user_doc = await self.__user_repo.get_by_id(user_id)
        except InvalidId:
            raise UserNotFoundError()
        
        if not user_doc:
            raise UserNotFoundError()

        if not user_doc["is_active"]:
            return User(
                id=str(user_doc["_id"]),
                username="deleted user",
                is_active=False
            )

        return User.from_document(user_doc)

    async def register_user(self, user_in: UserCreate) -> User | Exception:
        existing = await self.get_by_email(user_in.email)   
        if existing:
            raise UserAlreadyExistsError()

        new_user = {
            "username": user_in.username,
            "email": user_in.email,
            "hashed_password": hash_password(user_in.password),
            "is_active": True,
        }

        new_user_id = None

        try:
            new_user_id = await self.__user_repo.create(new_user)
        except:
            raise DatabaseError()

        return User(
            id=new_user_id,
            username=new_user["username"],
            is_active=new_user["is_active"]
        )
    
    async def deactivate(self, user_id: str) -> bool:
        deactivated = await self.__user_repo.update(user_id, { "is_active": False })
        if not deactivated:
            raise DatabaseError("Failed to deactivate user")
        return deactivated
