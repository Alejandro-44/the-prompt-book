from app.repositories.user_repository import UserRepository
from app.repositories.prompts_repository import PromptsRepository
from app.repositories.comments_repository import CommentsRepository
from .prompts_service import PromptsService
from .user_service import UserService
from .auth_service import AuthService
from .comments_service import CommentsService

class ServiceManager:
    def __init__(self, db):
        self.__db = db
        # Repositories
        self.__user_repo = UserRepository(self.__db)
        self.__prompts_repo = PromptsRepository(self.__db)
        self.__comments_repo = CommentsRepository(self.__db)
        # Services
        self.__user_service = UserService(self.__user_repo)
        self.__auth_service = AuthService(self.__user_repo)
        self.__prompts_service = PromptsService(self.__prompts_repo)
        self.__comments_service = CommentsService(self.__comments_repo)

    @property
    def user(self) -> UserService:
        return self.__user_service
    
    @property
    def auth(self) -> AuthService:
        return self.__auth_service
    
    @property
    def prompts(self) -> PromptsService:
        return self.__prompts_service
    
    @property
    def comments(self) -> CommentsService:
        return self.__comments_service
