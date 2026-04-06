import xml.etree.ElementTree as ET
from typing import Dict, List, Optional
from config import XML_FILES, TRAITS


class NameData:
    def __init__(
        self,
        name: str,
        gender: str,
        meaning: str,
        trait_scores: Dict[str, int],
    ):
        self.name = name
        self.gender = gender
        self.meaning = meaning
        self.trait_scores = trait_scores


class CelebrityData:
    def __init__(self, name: str, persons: List[str]):
        self.name = name
        self.persons = persons


class XMLParserService:
    def __init__(self):
        self._names_cache: Dict[str, NameData] = {}
        self._celebrities_cache: Dict[str, CelebrityData] = {}
        self._loaded = False

    def load_all(self):
        """Load all XML files into memory on startup."""
        if self._loaded:
            return

        self._names_cache = {}
        self._celebrities_cache = {}

        self._parse_names_file(XML_FILES["male_names"], "male")
        self._parse_names_file(XML_FILES["female_names"], "female")
        self._parse_celebrities_file(XML_FILES["male_celebrities"])
        self._parse_celebrities_file(XML_FILES["female_celebrities"])

        self._loaded = True

    def _parse_names_file(self, filepath: str, gender: str):
        """Parse a names XML file."""
        try:
            tree = ET.parse(filepath)
            root = tree.getroot()

            for names_entry in root.findall(".//names"):
                name_elem = names_entry.find("name")
                if name_elem is None or not name_elem.text:
                    continue

                name = name_elem.text.strip()
                if not name:
                    continue

                trait_scores = {}
                for trait in TRAITS:
                    elem = names_entry.find(trait)
                    trait_scores[trait] = int(elem.text) if elem is not None and elem.text else 0

                character_elem = names_entry.find("character")
                meaning = character_elem.text.strip() if character_elem is not None and character_elem.text else ""

                self._names_cache[name] = NameData(
                    name=name,
                    gender=gender,
                    meaning=meaning,
                    trait_scores=trait_scores,
                )
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")

    def _parse_celebrities_file(self, filepath: str):
        """Parse a celebrities XML file."""
        try:
            tree = ET.parse(filepath)
            root = tree.getroot()

            for list_entry in root.findall(".//list"):
                name_elem = list_entry.find("name")
                if name_elem is None or not name_elem.text:
                    continue

                name = name_elem.text.strip()
                if not name:
                    continue

                persons = []
                for child in list_entry:
                    if child.tag.startswith("person_") and child.text:
                        persons.append(child.text.strip())

                self._celebrities_cache[name] = CelebrityData(
                    name=name,
                    persons=persons,
                )
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")

    def get_all_names(self, gender: str = "both") -> List[NameData]:
        """Get all names, optionally filtered by gender."""
        self.load_all()
        if gender == "both":
            return list(self._names_cache.values())
        return [n for n in self._names_cache.values() if n.gender == gender]

    def get_name(self, name: str) -> Optional[NameData]:
        """Get a specific name by its string."""
        self.load_all()
        return self._names_cache.get(name)

    def get_celebrities(self, name: str) -> List[str]:
        """Get celebrities list for a given name."""
        self.load_all()
        celeb = self._celebrities_cache.get(name)
        return celeb.persons if celeb else []

    def get_all_names_with_celebrities(
        self, gender: str = "both"
    ) -> List[Dict]:
        """Get all names combined with their celebrity data."""
        self.load_all()
        results = []
        for name_data in self.get_all_names(gender):
            results.append({
                "name_data": name_data,
                "celebrities": self.get_celebrities(name_data.name),
            })
        return results


parser_service = XMLParserService()
