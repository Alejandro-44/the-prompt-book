from bson import ObjectId

mock_comments = [
    {
        "_id": ObjectId("69398c1d5393462cecf97601"),
        "content": "First comment",
        "prompt_id": ObjectId("69398c1d5393462cecf974b8"),
        "author_id": ObjectId("6930faa5239be95b75ed3c5c"),
        "author_name": "john doe",
        "author_handle": "john_doe",
        "pub_date": "2025-01-16T10:30:00.000Z",
    },
    {
        "_id": ObjectId("69398c1d5393462cecf97602"),
        "content": "Second comment",
        "prompt_id": ObjectId("69398c1d5393462cecf974b8"),
        "author_id": ObjectId("6930faa5239be95b75ed3c5c"),
        "author_name": "john doe",
        "author_handle": "john_doe",
        "pub_date": "2025-01-16T10:35:00.000Z",
    },
    {
        "_id": ObjectId("69398c1d5393462cecf97603"),
        "content": "Another prompt comment",
        "prompt_id": ObjectId("69398c1d5393462cecf974b9"),
        "author_id": ObjectId("693987497f7a423bcb83fe0c"),
        "author_name": "alex",
        "author_handle": "alex",
        "pub_date": "2025-01-16T10:40:00.000Z",
    },
]
