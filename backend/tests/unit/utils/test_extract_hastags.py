from app.utils import extract_hashtags


def test_returns_empty_list_when_text_has_no_hashtags():
    text = "This is a prompt without tags"
    assert extract_hashtags(text) == []


def test_extracts_single_hashtag():
    text = "Prompt for #React"
    assert extract_hashtags(text) == ["react"]


def test_extracts_multiple_hashtags():
    text = "Prompt for #React and #FastAPI"
    assert extract_hashtags(text) == ["react", "fastapi"]


def test_removes_duplicates_case_insensitive():
    text = "#React #react #REACT"
    assert extract_hashtags(text) == ["react"]


def test_preserves_order_of_first_occurrence():
    text = "#fastapi #react #fastapi #python"
    assert extract_hashtags(text) == ["fastapi", "react", "python"]


def test_ignores_text_without_space_before_hashtag():
    text = "ThisShouldNotCount#react"
    assert extract_hashtags(text) == []


def test_ignores_special_characters():
    text = "#react-query #react!"
    assert extract_hashtags(text) == ["react"]


def test_allows_numbers_and_underscores():
    text = "#gpt4 #react_query #api_v2"
    assert extract_hashtags(text) == ["gpt4", "react_query", "api_v2"]


def test_empty_string_returns_empty_list():
    assert extract_hashtags("") == []


def test_none_returns_empty_list():
    assert extract_hashtags(None) == []
