"""Column types that store the same Python value correctly on both backends.

The production database is Supabase (PostgreSQL) whose schema uses TEXT[] and
JSONB columns. The local fallback is SQLite, which has neither, so these types
store JSON text there instead. Application code always sees lists and dicts.
"""
import json

from sqlalchemy import JSON, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.types import TypeDecorator


class StringList(TypeDecorator):
    """A list of strings: TEXT[] on PostgreSQL, JSON text on SQLite."""

    impl = Text
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(ARRAY(Text))
        return dialect.type_descriptor(Text())

    def process_bind_param(self, value, dialect):
        items = [str(v).strip() for v in (value or []) if str(v).strip()]
        if dialect.name == "postgresql":
            return items
        return json.dumps(items)

    def process_result_value(self, value, dialect):
        if value is None:
            return []
        if isinstance(value, list):
            return [str(v) for v in value if v]
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(v) for v in parsed if v]
        except (TypeError, ValueError):
            pass
        # Legacy SQLite rows stored comma-separated tags.
        return [v.strip() for v in str(value).split(",") if v.strip()]


# A JSON object: JSONB on PostgreSQL, JSON text on SQLite.
JSONData = JSON().with_variant(JSONB, "postgresql")
