from typing import Dict, List, Tuple
import random
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
    def search_names(
        gender: str = "both",
        user_traits: Dict[str, int] = None,
        limit: int = 10,
    ) -> List[NameProfileWithScore]:
        """
        Search and rank names based on trait preferences.
        
        Args:
            gender: "male", "female", or "both"
            user_traits: Dict of trait preferences
            limit: Maximum number of results
            
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

            match_score = SearchEngine.calculate_match_score(
                name_data, user_traits
            )

            if match_score > 0 or not user_traits:
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


search_engine = SearchEngine()
