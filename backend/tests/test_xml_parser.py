import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.xml_parser import parser_service
from config import TRAITS


class TestXMLParser:
    @pytest.fixture(autouse=True)
    def setup(self):
        parser_service.load_all()

    def test_load_male_names(self):
        names = parser_service.get_all_names("male")
        assert len(names) > 0
        assert all(n.gender == "male" for n in names)

    def test_load_female_names(self):
        names = parser_service.get_all_names("female")
        assert len(names) > 0
        assert all(n.gender == "female" for n in names)

    def test_load_both_genders(self):
        names = parser_service.get_all_names("both")
        male_count = len(parser_service.get_all_names("male"))
        female_count = len(parser_service.get_all_names("female"))
        assert len(names) == male_count + female_count

    def test_get_specific_name(self):
        name_data = parser_service.get_name("Азамат")
        assert name_data is not None
        assert name_data.name == "Азамат"
        assert name_data.gender == "male"
        assert name_data.meaning != ""

    def test_trait_scores(self):
        name_data = parser_service.get_name("Азамат")
        assert name_data is not None
        for trait in TRAITS:
            assert trait in name_data.trait_scores
            assert isinstance(name_data.trait_scores[trait], int)

    def test_celebrities(self):
        celebs = parser_service.get_celebrities("Азамат")
        assert len(celebs) > 0

    def test_nonexistent_name(self):
        name_data = parser_service.get_name("NonExistentName123")
        assert name_data is None

    def test_celebrities_empty_for_unknown(self):
        celebs = parser_service.get_celebrities("UnknownName")
        assert celebs == []
