from fastapi import APIRouter, HTTPException
from models.search import SearchRequest, SearchResponse, RandomNameRequest, RandomNameResponse, NameOfTheDayResponse, DictionaryRequest, DictionaryResponse
from models.name import TraitsResponse, TraitInfo
from services.search_engine import search_engine
from config import TRAITS

router = APIRouter(prefix="/api", tags=["API"])

TRAIT_LABELS = {
    "beautiful": {"label": "Матур", "label_tatar": "Матур"},
    "smart": {"label": "Акыллы", "label_tatar": "Акыллы"},
    "strong": {"label": "Көчле", "label_tatar": "Көчле"},
    "believer": {"label": "Иманлы", "label_tatar": "Иманлы"},
    "rich": {"label": "Бай", "label_tatar": "Бай"},
    "patience": {"label": "Сабыр", "label_tatar": "Сабыр"},
    "merciful": {"label": "Мөрхәмәтле", "label_tatar": "Мөрхәмәтле"},
    "honorable": {"label": "Намус", "label_tatar": "Намус"},
    "generous": {"label": "Юмарт", "label_tatar": "Юмарт"},
    "leadership": {"label": "Җитәкче", "label_tatar": "Җитәкче"},
    "creative": {"label": "Иҗади", "label_tatar": "Иҗади"},
    "wise": {"label": "Зирәк", "label_tatar": "Зирәк"},
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
        if not (0 <= value <= 10):
            raise HTTPException(
                status_code=400,
                detail=f"Trait value must be between 0 and 10, got {value}",
            )

    results = search_engine.search_names(
        gender=request.gender,
        user_traits=request.traits,
        limit=request.limit,
        search_query=request.search_query,
        min_score=request.min_score,
        has_celebrities=request.has_celebrities,
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


@router.post("/random", response_model=RandomNameResponse)
async def get_random_name(request: RandomNameRequest):
    """Get a random name (Surprise me feature)."""
    if request.gender not in ["male", "female", "both"]:
        raise HTTPException(
            status_code=400,
            detail="Gender must be 'male', 'female', or 'both'",
        )
    
    try:
        name_profile = search_engine.get_random_name(gender=request.gender)
        return RandomNameResponse(name=name_profile)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/name-of-the-day", response_model=NameOfTheDayResponse)
async def get_name_of_the_day():
    """Get the featured name of the day."""
    import datetime
    
    try:
        name_profile = search_engine.get_name_of_the_day()
        return NameOfTheDayResponse(
            name=name_profile,
            date=datetime.date.today().isoformat()
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/dictionary", response_model=DictionaryResponse)
async def get_dictionary(request: DictionaryRequest):
    """Get all names for dictionary browsing."""
    if request.gender not in ["male", "female", "both"]:
        raise HTTPException(
            status_code=400,
            detail="Gender must be 'male', 'female', or 'both'",
        )
    
    names = search_engine.get_all_names_for_dictionary(
        gender=request.gender,
        search_query=request.search_query,
        has_celebrities=request.has_celebrities,
    )
    
    return DictionaryResponse(
        names=names,
        total=len(names),
    )
