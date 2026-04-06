import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

XML_FILES = {
    "male_names": os.path.join(BASE_DIR, "man_names.xml"),
    "female_names": os.path.join(BASE_DIR, "woman_names.xml"),
    "male_celebrities": os.path.join(BASE_DIR, "men_celebrity.xml"),
    "female_celebrities": os.path.join(BASE_DIR, "women_celebrity.xml"),
}

TRAITS = ["beautiful", "smart", "strong", "believer", "rich"]

DEFAULT_SEARCH_LIMIT = 10
