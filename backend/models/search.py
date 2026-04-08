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
    search_query: Optional[str] = Field(
        default=None,
        description="Optional text search in name meanings",
        example="бөек"
    )
    min_score: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="Minimum match score threshold"
    )
    has_celebrities: bool = Field(
        default=False,
        description="Filter to only names with celebrities"
    )


class SearchResponse(BaseModel):
    results: List[NameProfileWithScore]
    total_matches: int


class RandomNameRequest(BaseModel):
    gender: str = Field(default="both", description="male, female, or both")


class RandomNameResponse(BaseModel):
    name: NameProfileWithScore


class NameOfTheDayResponse(BaseModel):
    name: NameProfileWithScore
    date: str


class DictionaryRequest(BaseModel):
    gender: str = Field(default="both", description="male, female, or both")
    search_query: Optional[str] = Field(
        default=None,
        description="Optional text search in name meanings"
    )
    has_celebrities: bool = Field(
        default=False,
        description="Filter to only names with celebrities"
    )


class DictionaryResponse(BaseModel):
    names: List[NameProfileWithScore]
    total: int
