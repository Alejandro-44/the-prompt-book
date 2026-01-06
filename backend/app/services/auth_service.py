from app.repositories.user_repository import UserRepository
from app.core.security import create_access_token, hash_password, verify_password
from app.core.exceptions import UnauthorizedError, UserNotFoundError

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.__user_repo = user_repo

    async def _get_user_by_email(self, email: str) -> dict:
        user = await self.__user_repo.get_one({ "email": email, "is_active": True })
        if not user:
            raise UnauthorizedError()
        return user

    def _verify_user_password(self, password: str, hashed_password: str) -> None:
        if not verify_password(password, hashed_password):
            raise UnauthorizedError()

    async def login(self, email: str, password: str) -> str:
        user = await self._get_user_by_email(email)
        self._verify_user_password(password, user["hashed_password"])

        return create_access_token({
            "sub": str(user["_id"]),
            "email": user["email"],
        })

    async def change_password(
        self,
        user_id: str,
        old_password: str,
        new_password: str,
    ) -> None:
        user = await self.__user_repo.get_one({ "id": user_id })
        if not user:
            raise UserNotFoundError()

        self._verify_user_password(old_password, user["hashed_password"])

        new_hashed_password = hash_password(new_password)

        updated = await self.__user_repo.update(
            user_id,
            {"hashed_password": new_hashed_password},
        )

        if not updated:
            raise UserNotFoundError()
        
        return True
