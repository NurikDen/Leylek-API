from pydantic import BaseModel
from typing import Dict, Optional, List


class NameProfile(BaseModel):
    name: str
    gender: str
    meaning: str
    trait_scores: Dict[str, int]
    celebrities: List[str]


class NameProfileWithScore(NameProfile):
    match_score: float


class TraitInfo(BaseModel):
    key: str
    label: str
    label_tatar: str


class TraitsResponse(BaseModel):
    traits: List[TraitInfo]
