import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestAPI:
    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    def test_get_traits(self):
        response = client.get("/api/traits")
        assert response.status_code == 200
        data = response.json()
        assert "traits" in data
        assert len(data["traits"]) == 5

    def test_search_names(self):
        response = client.post(
            "/api/search",
            json={
                "gender": "male",
                "traits": {"smart": 5, "beautiful": 3},
                "limit": 10,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "total_matches" in data

    def test_search_invalid_gender(self):
        response = client.post(
            "/api/search",
            json={
                "gender": "invalid",
                "traits": {"smart": 5},
                "limit": 10,
            },
        )
        assert response.status_code == 400

    def test_search_invalid_trait(self):
        response = client.post(
            "/api/search",
            json={
                "gender": "male",
                "traits": {"invalid_trait": 5},
                "limit": 10,
            },
        )
        assert response.status_code == 400

    def test_search_trait_value_out_of_range(self):
        response = client.post(
            "/api/search",
            json={
                "gender": "male",
                "traits": {"smart": 10},
                "limit": 10,
            },
        )
        assert response.status_code == 400

    def test_get_name(self):
        response = client.get("/api/name/Азамат")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Азамат"
        assert "trait_scores" in data
        assert "celebrities" in data

    def test_get_name_not_found(self):
        response = client.get("/api/name/NonExistentName123")
        assert response.status_code == 404
