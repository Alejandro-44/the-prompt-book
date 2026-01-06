from bson import ObjectId
from bson.errors import InvalidId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema

class PyObjectId:
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        source_type,
        handler: GetCoreSchemaHandler,
    ):
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, value):
        try:
            return ObjectId(value)
        except (InvalidId, TypeError):
            raise ValueError("Invalid ObjectId")
