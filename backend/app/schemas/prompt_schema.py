from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel


class PromptBase(BaseModel):
    title: str
    description: str
    prompt: str
    model: str
    result_example: str | None = None
    media_url: str | None = None


class PromptCreate(PromptBase):
    pass


class Prompt(PromptBase):
    id: str
    hashtags: List[str]
    pub_date: datetime
    author_id: str
    author_name: str
    author_handle: str
    likes_count: int
    like_by_me: bool = False

    @staticmethod
    def from_document(document):
        return Prompt(
            id=str(document["_id"]),
            title=document["title"],
            description=document["description"],
            prompt=document["prompt"],
            model=document["model"],
            result_example=document.get("result_example"),
            media_url=document.get("media_url"),
            hashtags=document.get("hashtags", []),
            pub_date=document["pub_date"],
            author_id=str(document["author_id"]),
            author_name=document["author_name"],
            author_handle=document["author_handle"],
            likes_count=document["likes_count"]
        )


class PromptUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    result_example: Optional[str] = None
    media_url: Optional[str] = None
    model: Optional[str] = None

class PromptSummary(BaseModel):
    id: str
    title: str
    description: str
    hashtags: List[str]
    model: str
    pub_date: datetime
    author_name: str
    author_handle: str
    likes_count: int

    @staticmethod
    def from_document(document):
        return PromptSummary(
            id=str(document["_id"]),
            title=document["title"],
            description=document["description"],
            hashtags=document.get("hashtags", []),
            model=document["model"],
            pub_date=document["pub_date"],
            author_name=document["author_name"],
            author_handle=document["author_handle"],
            likes_count=document["likes_count"]
        )
