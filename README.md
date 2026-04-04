# Leylek - Implementation Plan

## Project Overview

**Leylek** is a unique platform featuring a meaning-based search engine that allows users to discover Tatar names by selecting desired traits or concepts rather than spelling, powered by a dedicated RESTful API and an intuitive, button-driven frontend.

---

## Technology Stack

- **Backend**: FastAPI (Python)
- **Database**: XML files (existing)
- **Frontend**: Node.js (JavaScript/TypeScript)
- **API Style**: RESTful

---

### Trait Categories:
- **beautiful** - Beauty/aesthetics
- **smart** - Intelligence/wisdom
- **strong** - Strength/courage
- **believer** - Faith/religiosity
- **rich** - Wealth/prosperity
- **character** - Text description of meaning
---

## Version 1: Core MVP

### Goal: One feature done well - Meaning-based name search with results display

### Features:

#### 1. Backend (FastAPI)
- **XML Parser Service**: Load and parse all XML files into structured data
- **Search API Endpoint**: `POST /api/search`
  - Accepts selected traits (beautiful, smart, strong, believer, rich) with importance levels
  - Returns ranked list of names with:
    - Name
    - Gender
    - Meaning (character field)
    - Trait scores
    - Associated celebrities
- **Name Details Endpoint**: `GET /api/name/{name}`
  - Returns full profile for a specific name
- **"Best Match" Algorithm**: Simple weighted scoring based on selected traits
  - Users select which traits matter to them
  - Algorithm ranks names by sum of selected trait scores
  - Returns top 10-20 results

#### 2. Database
- Use existing XML files as-is
- Implement efficient in-memory caching on startup
- No database migration needed for V1

#### 3. Frontend (Web App)
- **Landing Page**: 
  - Project branding (Leylek logo, tagline)
  - Brief explanation of the concept
- **Search Page**:
  - Gender selection (Male/Female/Both)
  - Trait selection buttons with visual indicators:
    - Beautiful (Гүзәллек)
    - Smart (Акыллы)
    - Strong (Көчле)
    - Believer (Динле)
    - Rich (Бай)
  - "Search" button
- **Results Page**:
  - List of matched names ranked by relevance
  - Each result shows: Name, meaning, top trait match
  - Click to expand for full details + celebrities
- **Name Detail Modal/Page**:
  - Full name profile
  - All trait scores visualized
  - List of celebrities with this name
  - Etymology/meaning description

---

## Version 2: Enhanced Experience

### Goal: Improve V1 features + add new functionality

### Improvements to V1 Features:

#### 1. Enhanced Search Algorithm
- Implement semantic search on the `character` field
- Add fuzzy matching for partial trait preferences
- Improve ranking with relevance scoring (not just sum)
- Add filtering options (minimum score thresholds)

#### 2. Advanced Frontend Features
- **Multi-trait weighting**: Allow users to set importance levels (1-5) for each trait
- **Search history**: Save recent searches locally
- **Favorites**: Bookmark names for later comparison
- **Comparison view**: Side-by-side name comparison
- **Share functionality**: Generate shareable links for name profiles

#### 3. New Features
- **Name of the Day**: Daily featured name on homepage
- **Random Name Generator**: "Surprise me" button for inspiration
- **Celebrity Filter**: Search by notable people associated with names
- **Meaning Cloud**: Visual word cloud of popular meanings
- **Export**: Download name profiles as PDF/cards

#### 4. Backend Enhancements
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Caching**: Redis or in-memory caching for frequent queries
- **Rate Limiting**: Prevent API abuse
- **Analytics**: Track popular searches (anonymous)
- **Error Handling**: Better validation and error messages

#### 5. Deployment
- **Backend**: Deploy to cloud (Render, Railway, or similar)
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Domain**: Optional custom domain (leylek.app or similar)
- **CI/CD**: Automated testing and deployment pipeline
- **README**: Comprehensive documentation with setup instructions

## API Endpoints (Detailed)

### Version 1 Endpoints:

#### `GET /`
- **Description**: API health check
- **Response**: `{"status": "ok", "message": "Leylek API is running"}`

#### `POST /api/search`
- **Description**: Search names by traits
- **Request Body**:
  ```json
  {
    "gender": "male",  // "male", "female", or "both"
    "traits": {
      "beautiful": 3,
      "smart": 5,
      "strong": 0,
      "believer": 4,
      "rich": 0
    },
    "limit": 10
  }
  ```
- **Response**:
  ```json
  {
    "results": [
      {
        "name": "Азамат",
        "gender": "male",
        "meaning": "Гениаль, бөек булу",
        "trait_scores": {
          "beautiful": 2,
          "smart": 2,
          "strong": 2,
          "believer": 2,
          "rich": 2
        },
        "match_score": 18,
        "celebrities": [
          "Азамат (738-???) - бөек патша",
          "Азамат Мусагалиев (1984-х.в.) - комик, актер",
          "Азамат Гафаров (1974-х.в.) - җырчы, драма артисты"
        ]
      }
    ],
    "total_matches": 45
  }
  ```

#### `GET /api/name/{name}`
- **Description**: Get full name details
- **Path Parameter**: `name` (URL-encoded Tatar name)
- **Response**:
  ```json
  {
    "name": "Азамат",
    "gender": "male",
    "meaning": "Гениаль, бөек булу",
    "trait_scores": {
      "beautiful": 2,
      "smart": 2,
      "strong": 2,
      "believer": 2,
      "rich": 2
    },
    "celebrities": [
      "Азамат (738-???) - бөек патша",
      "Азамат Мусагалиев (1984-х.в.) - комик, актер",
      "Азамат Гафаров (1974-х.в.) - җырчы, драма артисты"
    ]
  }
  ```

#### `GET /api/traits`
- **Description**: Get available trait categories
- **Response**:
  ```json
  {
    "traits": [
      {"key": "beautiful", "label": "Beautiful", "label_tatar": "Гүзәллек"},
      {"key": "smart", "label": "Smart", "label_tatar": "Акыллы"},
      {"key": "strong", "label": "Strong", "label_tatar": "Көчле"},
      {"key": "believer", "label": "Believer", "label_tatar": "Динле"},
      {"key": "rich", "label": "Rich", "label_tatar": "Бай"}
    ]
  }
  ```

---

## Key Technical Decisions

1. **XML as Database**: Keep existing XML files for V1, consider migration to SQLite/PostgreSQL for V2 if needed
2. **In-Memory Caching**: Load all XML data into memory on startup (dataset is small enough: ~500 names)
3. **Frontend Framework**: Use React with TypeScript for type safety
4. **Styling**: Bootstrap CSS + custom styles for quick, responsive UI
5. **API Documentation**: Use FastAPI's built-in Swagger/OpenAPI
6. **Testing**: pytest for backend, Jest for frontend

---


## Future Possibilities (Beyond V2)

- Mobile app (React Native / Flutter)
- User accounts and personalized recommendations
- Community contributions for name data
- Integration with baby naming platforms
- LLM-powered chatbot for name consultation
- Advanced etymology research tools
- Multi-language support (Tatar, Russian, English)

---


## Team
**MslmTatSoft**

**Project**: Leylek  
**Description**: Meaning-based Tatar name discovery platform  
**Tech Stack**: FastAPI (Python) + XML + Node.js/TypeScript  

---

*Last Updated: April 4, 2026*
