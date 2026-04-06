from fastapi import APIRouter, HTTPException
from models.search import SearchRequest, SearchResponse
from models.name import TraitsResponse, TraitInfo
from services.search_engine import search_engine
from config import TRAITS

router = APIRouter(prefix="/api", tags=["API"])

TRAIT_LABELS = {
    "beautiful": {"label": "Beautiful", "label_tatar": "Гүзәллек"},
    "smart": {"label": "Smart", "label_tatar": "Акыллы"},
    "strong": {"label": "Strong", "label_tatar": "Көчле"},
    "believer": {"label": "Believer", "label_tatar": "Динле"},
    "rich": {"label": "Rich", "label_tatar": "Бай"},
}


@router.get("/traits", response_model=TraitsResponse)
async def get_traits():
    """Get available trait categories."""
    traits = [
        TraitInfo(
            key=trait,
            label=TRAIT_LABELS[trait]["label"],
            label_tatar=TRAIT_LABELS[trait]["label_tatar"],
        )
        for trait in TRAITS
    ]
    return TraitsResponse(traits=traits)


@router.post("/search", response_model=SearchResponse)
async def search_names(request: SearchRequest):
    """Search names by traits."""
    if request.gender not in ["male", "female", "both"]:
        raise HTTPException(
            status_code=400,
            detail="Gender must be 'male', 'female', or 'both'",
        )

    for trait, value in request.traits.items():
        if trait not in TRAITS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid trait: {trait}. Must be one of {TRAITS}",
            )
        if not (0 <= value <= 5):
            raise HTTPException(
                status_code=400,
                detail=f"Trait value must be between 0 and 5, got {value}",
            )

    results = search_engine.search_names(
        gender=request.gender,
        user_traits=request.traits,
        limit=request.limit,
    )

    return SearchResponse(
        results=results,
        total_matches=len(results),
    )


@router.get("/name/{name}")
async def get_name(name: str):
    """Get full name details."""
    try:
        profile = search_engine.get_name_profile(name)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
