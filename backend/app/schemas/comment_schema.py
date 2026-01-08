from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: str
    prompt_id: str
    pub_date: datetime
    author_id: str
    author_name: str
    author_handle: str

    @staticmethod
    def from_document(document):
        return Comment(
            id=str(document["_id"]),
            content=document["content"],
            prompt_id=str(document["prompt_id"]),
            author_id=str(document["author_id"]),
            author_name=document["author_name"],
            author_handle=document["author_handle"],
            pub_date=document["pub_date"],
        )

class CommentUpdate(BaseModel):
    content: Optional[str] = None
