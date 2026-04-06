# Leylek - Tatar Name Discovery Platform

**Leylek** is a unique platform featuring a meaning-based search engine that allows users to discover Tatar names by selecting desired traits or concepts rather than spelling.

## 🌟 Features

- **Meaning-First Search**: Find names by selecting traits (Beautiful, Smart, Strong, Believer, Rich)
- **Best Match Algorithm**: Ranks names based on relevance to your preferences
- **Rich Profiles**: Each name includes meaning, trait scores, and notable celebrities
- **Cultural Context**: Discover Tatar naming traditions and historical figures

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: XML files
- **Frontend**: React + TypeScript (Vite)
- **API**: RESTful

## 📋 Prerequisites

- Python 3.12+
- Node.js 18+
- npm

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install --break-system-packages fastapi uvicorn pydantic lxml pytest httpx
```

3. Start the backend server:
```bash
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The web app will be available at `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /
```

### Get Available Traits
```
GET /api/traits
```

### Search Names
```
POST /api/search
Body: {
  "gender": "male" | "female" | "both",
  "traits": {
    "beautiful": 0-5,
    "smart": 0-5,
    "strong": 0-5,
    "believer": 0-5,
    "rich": 0-5
  },
  "limit": 1-50
}
```

### Get Name Details
```
GET /api/name/{name}
```

## 🧪 Running Tests

```bash
cd backend
python3 -m pytest tests/ -v
```

## 📁 Project Structure

```
Leylek-API/
├── backend/                    # FastAPI application
│   ├── main.py                # Entry point
│   ├── config.py              # Configuration
│   ├── models/                # Pydantic models
│   ├── services/              # Business logic
│   │   ├── xml_parser.py      # XML parsing
│   │   └── search_engine.py   # Search algorithm
│   ├── routers/               # API endpoints
│   └── tests/                 # Unit tests
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API client
│   │   ├── styles/            # CSS
│   │   └── types/             # TypeScript types
│   └── package.json
│
└── XML databases              # Name and celebrity data
```

## 🎯 How It Works

1. **Select Gender**: Choose male, female, or both
2. **Set Trait Importance**: Use sliders (0-5) to indicate which traits matter most
3. **Search**: Click "Search Names" to find matching names
4. **Explore Results**: Click any name card to see full details including:
   - Meaning and etymology
   - All trait scores
   - Notable people with that name

## 📊 "Best Match" Algorithm

The algorithm calculates a match score based on:
- User-selected trait importance (0-5 scale)
- Name's trait scores (0-10 scale)
- Weighted sum normalized to 0-100%

Formula:
```
score = Σ(name_trait_value × user_importance)
normalized = (score / max_possible) × 100
```

## 🚧 Note

- Telegram bots are blocked on university VMs - this project uses a web interface instead
- All XML data is pre-existing and loaded into memory on startup
- Tatar language support with Cyrillic script

## 👥 Team

**MslmTatSoft**

## 📝 License

Educational project

---

*Last Updated: April 4, 2026*
