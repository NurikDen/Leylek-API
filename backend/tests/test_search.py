import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.search_engine import search_engine
from services.xml_parser import parser_service


class TestSearchEngine:
    @pytest.fixture(autouse=True)
    def setup(self):
        parser_service.load_all()

    def test_search_with_traits(self):
        results = search_engine.search_names(
            gender="male",
            user_traits={"smart": 5, "beautiful": 3},
            limit=10,
        )
        assert len(results) <= 10
        assert all(r.match_score > 0 for r in results)

    def test_search_no_traits(self):
        results = search_engine.search_names(
            gender="female",
            user_traits={},
            limit=5,
        )
        assert len(results) <= 5

    def test_search_both_gender(self):
        results = search_engine.search_names(
            gender="both",
            user_traits={"strong": 4},
            limit=20,
        )
        assert len(results) <= 20

    def test_search_respects_limit(self):
        results = search_engine.search_names(
            gender="male",
            user_traits={"believer": 5},
            limit=3,
        )
        assert len(results) <= 3

    def test_results_sorted_by_score(self):
        results = search_engine.search_names(
            gender="male",
            user_traits={"smart": 5, "rich": 3},
            limit=20,
        )
        for i in range(len(results) - 1):
            assert results[i].match_score >= results[i + 1].match_score

    def test_get_name_profile(self):
        profile = search_engine.get_name_profile("Азамат")
        assert profile.name == "Азамат"
        assert profile.gender == "male"
        assert profile.meaning != ""
        assert len(profile.celebrities) > 0

    def test_get_name_profile_not_found(self):
        with pytest.raises(ValueError):
            search_engine.get_name_profile("NonExistentName123")

    def test_match_score_calculation(self):
        name_data = parser_service.get_name("Азамат")
        score = search_engine.calculate_match_score(
            name_data, {"smart": 2, "beautiful": 2}
        )
        assert score >= 0
        assert score <= 100
