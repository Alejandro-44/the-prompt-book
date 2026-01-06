from app.schemas.user_schema import UserCreate, User
from app.core.security import hash_password
from app.repositories.user_repository import UserRepository
from app.core.exceptions import (
    UserNotFoundError,
    UserAlreadyExistsError,
    DatabaseError,
)
from app.core.types import PyObjectId

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.__user_repo = user_repo
    
    async def get_one(self, filters: dict) -> User:
        user_document = await self.__user_repo.get_one(filters)
        if not user_document:
            raise UserNotFoundError
        
        user = User.from_document(user_document)
        if not user.is_active:
            return User(
                id=user.id,
                username="deleted user",
                is_active=False
            )
        
        return user

    async def register_user(self, user_in: UserCreate) -> User:
        try:
            existing = await self.get_one({ "email": user_in.email, "is_active": True })   
            if existing:
                raise UserAlreadyExistsError()
        except UserNotFoundError:
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
    
    async def deactivate(self, user_id: PyObjectId) -> bool:
        deactivated = await self.__user_repo.update(user_id, { "is_active": False })
        if not deactivated:
            raise DatabaseError("Failed to deactivate user")
        return deactivated
