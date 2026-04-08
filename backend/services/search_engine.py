from typing import Dict, List, Tuple, Optional
import random
import re
from services.xml_parser import parser_service
from models.name import NameProfile, NameProfileWithScore
from config import TRAITS


class SearchEngine:
    @staticmethod
    def calculate_match_score(
        name_data, user_traits: Dict[str, int]
    ) -> float:
        """
        Calculate match score based on user trait preferences.

        Args:
            name_data: NameData object with trait scores
            user_traits: Dict of trait preferences (0-5 scale)

        Returns:
            Normalized score (0-100)
        """
        score = 0
        total_weight = sum(user_traits.values())

        if total_weight == 0:
            return 0.0

        for trait, weight in user_traits.items():
            if weight > 0 and trait in TRAITS:
                name_trait_value = name_data.trait_scores.get(trait, 0)
                score += name_trait_value * weight

        max_possible = total_weight * 10
        normalized_score = (score / max_possible) * 100

        return round(normalized_score, 2)

    @staticmethod
    def semantic_search_meaning(
        name_data, search_query: str
    ) -> float:
        """
        Search for names based on meaning/character field using keyword matching.
        
        Args:
            name_data: NameData object
            search_query: Search string to match against meaning
            
        Returns:
            Relevance score (0-100) based on keyword matches
        """
        if not search_query or not name_data.meaning:
            return 0.0
        
        # Normalize the search query and meaning
        query_words = set(search_query.lower().split())
        meaning_words = set(name_data.meaning.lower().split())
        
        # Calculate word overlap
        matching_words = query_words & meaning_words
        if not matching_words:
            # Check for partial matches (substring matching)
            for qw in query_words:
                for mw in meaning_words:
                    if qw in mw or mw in qw:
                        matching_words.add(qw)
        
        if not matching_words:
            return 0.0
        
        # Score based on coverage
        coverage = len(matching_words) / len(query_words)
        return round(coverage * 100, 2)

    @staticmethod
    def search_names(
        gender: str = "both",
        user_traits: Dict[str, int] = None,
        limit: int = 10,
        search_query: Optional[str] = None,
        min_score: Optional[float] = None,
        has_celebrities: bool = False,
    ) -> List[NameProfileWithScore]:
        """
        Search and rank names based on trait preferences and optional filters.

        Args:
            gender: "male", "female", or "both"
            user_traits: Dict of trait preferences
            limit: Maximum number of results
            search_query: Optional text search in meaning/character field
            min_score: Minimum match score threshold
            has_celebrities: Filter to only names with celebrities
            
        Returns:
            List of NameProfileWithScore sorted by match_score descending
        """
        if user_traits is None:
            user_traits = {}

        all_names_with_celebs = parser_service.get_all_names_with_celebrities(
            gender
        )

        results = []
        for item in all_names_with_celebs:
            name_data = item["name_data"]
            celebrities = item["celebrities"]
            
            # Apply celebrity filter if requested
            if has_celebrities and not celebrities:
                continue
            
            # Calculate trait-based match score
            match_score = SearchEngine.calculate_match_score(
                name_data, user_traits
            )
            
            # Calculate semantic search score if query provided
            semantic_score = 0.0
            if search_query:
                semantic_score = SearchEngine.semantic_search_meaning(
                    name_data, search_query
                )
                # Combine trait score and semantic score (weighted average)
                if user_traits and any(v > 0 for v in user_traits.values()):
                    match_score = (match_score * 0.6) + (semantic_score * 0.4)
                else:
                    match_score = semantic_score
            
            # Apply minimum score filter
            if min_score is not None and match_score < min_score:
                continue

            # Include results if there's a search query with matches or if no specific filters
            if match_score > 0 or (not user_traits and not search_query):
                profile = NameProfileWithScore(
                    name=name_data.name,
                    gender=name_data.gender,
                    meaning=name_data.meaning,
                    trait_scores=name_data.trait_scores,
                    celebrities=celebrities,
                    match_score=match_score,
                )
                results.append(profile)

        results.sort(key=lambda x: x.match_score, reverse=True)

        # Take first 10 results and randomly select one
        top_results = results[:10]
        if top_results:
            return [random.choice(top_results)]
        return []

    @staticmethod
    def get_name_profile(name: str) -> NameProfile:
        """
        Get full profile for a specific name.

        Args:
            name: The name string to look up

        Returns:
            NameProfile object
        """
        name_data = parser_service.get_name(name)
        if name_data is None:
            raise ValueError(f"Name '{name}' not found")

        celebrities = parser_service.get_celebrities(name)

        return NameProfile(
            name=name_data.name,
            gender=name_data.gender,
            meaning=name_data.meaning,
            trait_scores=name_data.trait_scores,
            celebrities=celebrities,
        )

    @staticmethod
    def get_all_names_for_dictionary(
        gender: str = "both",
        search_query: str = None,
        has_celebrities: bool = False,
    ) -> List[NameProfileWithScore]:
        """
        Get all names for dictionary browsing (no random selection).
        
        Args:
            gender: "male", "female", or "both"
            search_query: Optional text search in meaning/character field
            has_celebrities: Filter to only names with celebrities
            
        Returns:
            List of ALL matching NameProfileWithScore
        """
        all_names_with_celebs = parser_service.get_all_names_with_celebrities(
            gender
        )

        results = []
        for item in all_names_with_celebs:
            name_data = item["name_data"]
            celebrities = item["celebrities"]
            
            # Apply celebrity filter if requested
            if has_celebrities and not celebrities:
                continue
            
            # Apply search query filter
            if search_query:
                semantic_score = SearchEngine.semantic_search_meaning(
                    name_data, search_query
                )
                if semantic_score == 0:
                    continue
                match_score = semantic_score
            else:
                match_score = 0.0

            profile = NameProfileWithScore(
                name=name_data.name,
                gender=name_data.gender,
                meaning=name_data.meaning,
                trait_scores=name_data.trait_scores,
                celebrities=celebrities,
                match_score=match_score,
            )
            results.append(profile)

        # Sort alphabetically by name
        results.sort(key=lambda x: x.name)

        return results

    @staticmethod
    def get_random_name(gender: str = "both") -> NameProfileWithScore:
        """
        Get a random name from the database.

        Args:
            gender: "male", "female", or "both"

        Returns:
            Random NameProfileWithScore
        """
        all_names_with_celebs = parser_service.get_all_names_with_celebrities(
            gender
        )
        
        if not all_names_with_celebs:
            raise ValueError("No names found in database")
        
        # Select random name
        item = random.choice(all_names_with_celebs)
        name_data = item["name_data"]
        celebrities = item["celebrities"]
        
        # Calculate match score (0 for random selection)
        match_score = 0.0
        
        return NameProfileWithScore(
            name=name_data.name,
            gender=name_data.gender,
            meaning=name_data.meaning,
            trait_scores=name_data.trait_scores,
            celebrities=celebrities,
            match_score=match_score,
        )

    @staticmethod
    def get_name_of_the_day() -> NameProfileWithScore:
        """
        Get a featured name based on the current date.
        Uses date-based seeding for consistent daily name.

        Returns:
            NameProfileWithScore for the day
        """
        import datetime
        
        # Use current date as seed for consistent daily name
        today = datetime.date.today()
        seed = int(today.strftime("%Y%m%d"))
        random.seed(seed)
        
        try:
            # Get all names and pick one deterministically
            all_names_with_celebs = parser_service.get_all_names_with_celebrities(
                "both"
            )
            
            if not all_names_with_celebs:
                raise ValueError("No names found in database")
            
            # Select name based on seeded random
            item = random.choice(all_names_with_celebs)
            name_data = item["name_data"]
            celebrities = item["celebrities"]
            
            return NameProfileWithScore(
                name=name_data.name,
                gender=name_data.gender,
                meaning=name_data.meaning,
                trait_scores=name_data.trait_scores,
                celebrities=celebrities,
                match_score=0.0,
            )
        finally:
            # Reset random seed to not affect other random operations
            random.seed()


search_engine = SearchEngine()
