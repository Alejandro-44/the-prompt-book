from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str
    username: str
    handle: str
    is_active: bool

    @staticmethod
    def from_document(document):
        return User(
            id=str(document["_id"]),
            username=document["username"],
            handle=document["handle"],
            is_active=document["is_active"],
        )


class PrivateUser(User):
    email: EmailStr

    @staticmethod
    def from_document(document):
        return PrivateUser(
            id=str(document["_id"]),
            username=document["username"],
            handle=document["handle"],
            email=document["email"],
            is_active=document["is_active"]
        )


class UpdatePassword(BaseModel):
    old_password: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
