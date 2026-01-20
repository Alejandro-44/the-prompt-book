class UserNotFoundError(Exception):
    """Raised when a user is not found in the database"""

class UserAlreadyExistsError(Exception):
    """Raised when trying to register a user with an existing email"""

class DatabaseError(Exception):
    """Raised when a database operation fails"""

class UnauthorizedError(Exception):
    """Raised when user fails in its authentication"""

class PromptOwnershipError(Exception):
    """Raised when a user tries to perform an action on a prompt they do not own"""

class PromptNotFoundError(Exception):
    """Raised when a prompt is not found in the database"""

class CommentNotFoundError(Exception):
    """Raised when a comment is not found in database"""

class AlreadyLikedError(Exception):
    """Raised when try to add a prompt that already exists"""

class LikeNotFoundError(Exception):
    """Raised when try to unlike a prompt that does not exist"""
