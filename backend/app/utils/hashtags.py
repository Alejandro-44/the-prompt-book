import re
from typing import List

HASHTAG_REGEX = re.compile(r"(?<!\w)#([a-zA-Z0-9_]+)")


def extract_hashtags(text: str) -> List[str]:
    """
    Extracts hashtags from a text.

    Rules:
    - Hashtags start with #
    - Allowed characters: a-z, A-Z, 0-9, _
    - Returned hashtags are lowercased
    - Duplicates are removed
    - Order of appearance is preserved
    """
    if not text:
        return []

    matches = HASHTAG_REGEX.findall(text)

    seen = set()
    hashtags: List[str] = []

    for tag in matches:
        normalized = tag.lower()
        if normalized not in seen:
            seen.add(normalized)
            hashtags.append(normalized)

    return hashtags
