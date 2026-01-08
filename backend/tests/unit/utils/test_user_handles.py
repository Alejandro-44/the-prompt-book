import re
import pytest

from app.utils import generate_handle


pytestmark = [pytest.mark.unit, pytest.mark.asyncio]


async def test_generate_simple_handle_when_available():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("John Doe", exists_fn)

    assert handle == "john_doe"


async def test_generate_handle_add_suffix_when_exists():
    existing = {"john_doe"}

    async def exists_fn(handle: str) -> bool:
        return handle in existing

    handle = await generate_handle("John Doe", exists_fn)

    assert handle.startswith("john_doe_")
    assert len(handle) <= 30


async def test_generate_handle_removes_accents_and_symbols():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("🚀 JohN DOe !!!", exists_fn)

    assert handle == "john_doe"


async def test_generate_handle_collapses_separators():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("John---Doe___Dev", exists_fn)

    assert handle == "john_doe_dev"


async def test_generate_handle_fallback_when_too_short():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("💩", exists_fn)

    assert handle.startswith("user_")
    assert len(handle) >= 8


async def test_generate_handle_respects_regex_rules():
    async def exists_fn(handle: str) -> bool:
        return False

    handle =  await generate_handle("__John__Doe__", exists_fn)

    assert not handle.startswith("_")
    assert not handle.endswith("_")

    assert "__" not in handle


async def test_generate_handle_is_lowercase():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("john doe", exists_fn)

    assert handle == "john_doe"


async def test_generate_handle_limits_length():
    async def exists_fn(handle: str) -> bool:
        return False

    long_name = "a" * 100
    handle = await generate_handle(long_name, exists_fn)

    assert len(handle) <= 30


async def test_generate_handle_multiple_collisions():
    existing = {
        "john_doe",
        "john_doe_abc",
        "john_doe_def",
        "john_doe_ghi",
    }

    async def exists_fn(handle: str) -> bool:
        return handle in existing

    handle = await generate_handle("John Doe", exists_fn)

    assert handle not in existing
    assert handle.startswith("john_doe_")


async def test_generate_handle_never_returns_empty():
    async def exists_fn(handle: str) -> bool:
        return False

    handle = await generate_handle("", exists_fn)

    assert handle
    assert handle.startswith("user_")
