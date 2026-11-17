from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Aggarwal Steels API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Exact origins allowed to call the API from a browser. Extra origins can be
    # added through the ALLOWED_ORIGINS env var (comma-separated).
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://aggarwalsteel.com",
        "https://www.aggarwalsteel.com",
        "https://agrawal-steels.vercel.app",
    ]
    # Regex for origins that vary, e.g. Vercel preview deployments.
    ALLOWED_ORIGIN_REGEX: str = r"^https://(www\.)?aggarwalsteel\.com$|^https://agrawal-steels(-[a-z0-9-]+)?\.vercel\.app$"

    DATABASE_URL: str = "sqlite:///./aggarwal_steels.db"

    SALES_EMAIL: str = "sales@aggarwalsteel.com"
    SALES_PHONE: str = "+917300070778"
    ALTERNATE_PHONE: str = "+917300096120"

    # Admin panel credentials. Set in backend/.env locally and in the Render
    # dashboard (Environment) for the live deployment.
    ADMIN_EMAIL: str = ""
    ADMIN_PASSWORD: str = ""
    ADMIN_SECRET: str = ""  # random string used to sign admin session tokens

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Accept a comma-separated string or list; normalise each origin.

        Tolerates stray quotes, brackets, whitespace and trailing slashes so a
        value like '"https://example.com/"' still matches the browser's Origin
        header, which is always scheme://host[:port] with no path.
        """
        if isinstance(v, str):
            items = v.split(",")
        else:
            items = list(v or [])
        origins: List[str] = []
        for raw in items:
            origin = str(raw).strip().strip("[]").strip().strip("'\"").strip().rstrip("/")
            if origin and origin not in origins:
                origins.append(origin)
        return origins


settings = Settings()
