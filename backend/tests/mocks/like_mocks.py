from bson import ObjectId

mock_likes = [
    {
        "_id": ObjectId("69398c1d5393462cecf97701"),
        "prompt_id": ObjectId("69398c1d5393462cecf974b8"),  # commented_prompt_1
        "user_id": ObjectId("6930faa5239be95b75ed3c5c"),  # johndoe
        "created_at": "2025-01-16T10:30:00.000Z",
    },
    {
        "_id": ObjectId("69398c1d5393462cecf97702"),
        "prompt_id": ObjectId("69398c1d5393462cecf974b9"),  # another prompt
        "user_id": ObjectId("6930faa5239be95b75ed3c5c"),  # johndoe
        "created_at": "2025-01-16T10:35:00.000Z",
    },
    {
        "_id": ObjectId("69398c1d5393462cecf97703"),
        "prompt_id": ObjectId("69398c1d5393462cecf974c1"),  # luna_prompt
        "user_id": ObjectId("6939872c7f7a423bcb83fe0b"),  # alex
        "created_at": "2025-01-16T10:40:00.000Z",
    },
]
