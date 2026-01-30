from fastapi import Request
from pymongo import TEXT
from pymongo.asynchronous.database import AsyncDatabase


def get_database(request: Request):
    return request.app.state.database


async def create_indexes(database: AsyncDatabase):
    prompts = database.prompts

    await prompts.create_index(
        [
            ("title", TEXT),
            ("description", TEXT),
            ("prompt", TEXT),
            ("result_example", TEXT),
            ("model", TEXT),
        ],
        name="prompts_text_index",
        background=True,
    )
