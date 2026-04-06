from pydantic import BaseModel, Field
from typing import Dict, Optional, List
from models.name import NameProfileWithScore


class SearchRequest(BaseModel):
    gender: str = Field(default="both", description="male, female, or both")
    traits: Dict[str, int] = Field(
        default={},
        description="Trait preferences with importance (0-5 scale)",
        example={"beautiful": 3, "smart": 5, "strong": 0, "believer": 4, "rich": 0}
    )
    limit: int = Field(default=10, ge=1, le=50, description="Number of results")


class SearchResponse(BaseModel):
    results: List[NameProfileWithScore]
    total_matches: int
