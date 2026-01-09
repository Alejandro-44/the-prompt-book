import re
import unicodedata
import secrets
import string
from typing import Callable, Awaitable

HANDLE_REGEX = re.compile(
    r'^(?!_)(?!.*__)[a-z0-9_]{3,30}(?<!_)$'
)

ALPHABET = string.ascii_lowercase + string.digits

def _normalize_base(value: str) -> str:
    """
    Normalize a string to use it as handle
    """
    value = value.strip().lower()

    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")

    value = re.sub(r"[.\-\s]+", "_", value)

    value = re.sub(r"[^a-z0-9_]", "", value)

    value = re.sub(r"_+", "_", value)

    value = value.strip("_")

    return value


def _random_suffix(length: int = 3) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


async def generate_handle(
    username: str,
    exists_fn: Callable[[str], Awaitable[bool]],
    min_length: int = 3,
    max_length: int = 30,
) -> str:
    """
    Generate a handle based on a username

    exists_fn(handle) -> bool
    """
    base = _normalize_base(username)

    if len(base) < min_length:
        base = f"user_{_random_suffix(5)}"

    base = base[:max_length]

    if HANDLE_REGEX.match(base) and not await exists_fn(base):
        return base

    for _ in range(10):
        suffix = _random_suffix(5)
        candidate = f"{base}_{suffix}"[:max_length]

        if HANDLE_REGEX.match(candidate) and not await exists_fn(candidate):
            return candidate

    return f"user_{_random_suffix(5)}"
