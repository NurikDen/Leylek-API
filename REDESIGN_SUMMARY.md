# Leylek Web App - Major Redesign

## Overview
Complete redesign of the Leylek web application with a cleaner, more focused user experience.

## Key Changes

### 1. Theme: White-Black-Gray Only
- Removed ALL colors (purple, pink, green, blue gradients)
- Strict white-black-gray color palette throughout
- Clean, minimalist design

### 2. Multi-Page Architecture
Added React Router with 3 dedicated pages:

#### Page 1: Search (Home - `/`)
- **Purpose**: Trait-based name search
- **Features**:
  - Gender selection (Male/Female/Both)
  - Trait importance sliders (0-5 scale)
  - Search button
  - **Single result display**: Shows only ONE name with full details
    - Name with gender icon
    - Meaning
    - Trait scores
    - Celebrities preview (shows first 2, indicates more)
    - Favorite button
  - Click result to open full detail modal

#### Page 2: Surprise Me (`/surprise`)
- **Purpose**: Tinder-like name discovery
- **Features**:
  - Gender selection
  - **Swipeable cards**:
    - Swipe RIGHT (or click ❤️) = Add to favorites
    - Swipe LEFT (or click ❌) = Skip
    - Touch and mouse drag support
    - Smooth animations
  - Full name details on card
  - Visual feedback for favorites
  - "Swipe hint" text for guidance

#### Page 3: Dictionary (`/dictionary`)
- **Purpose**: Browse all names like a dictionary
- **Features**:
  - **Search bar**: Search by name OR meaning
  - **Gender filter**: Male/Female/Both buttons
  - **Favorites filter**: Toggle to show only favorited names
  - List view of names with:
    - Gender icon
    - Name
    - Meaning
    - Favorite button
  - Click any name for full details
  - Results count display

### 3. Navigation
- New navigation bar below header
- 3 tabs: 🔍 Search | 🎲 Surprise | 📖 Dictionary
- Active tab highlighting
- Clean, minimal design

### 4. Removed Features
- ❌ Name of the Day section (may return later)
- ❌ Multiple results from search (now single result)
- ❌ Colorful buttons and gradients

### 5. Enhanced Features
- **Favorites system**: Improved with localStorage persistence
- **Share functionality**: Still available in detail modal
- **Search history**: Backend support ready (UI can be added later)
- **Semantic search**: Backend enhanced with meaning-based search

## File Structure Changes

### New Files Created
```
frontend/src/
├── pages/
│   ├── SearchPage.tsx          # Main search page
│   ├── SurpriseMePage.tsx      # Swipeable cards page
│   └── DictionaryPage.tsx      # Name dictionary browser
```

### Modified Files
```
frontend/src/
├── App.tsx                     # Complete rewrite with routing
├── styles/main.css             # Massive CSS update
├── components/Header.tsx       # Added title
├── components/NameDetail.tsx   # Updated share button styling
└── components/NameCard.tsx     # (kept for compatibility)
```

## CSS Changes

### Color Palette (STRICT)
```css
--black: #000000
--dark-gray: #1a1a1a
--medium-gray: #333333
--gray: #666666
--light-gray: #999999
--lighter-gray: #cccccc
--border-gray: #e0e0e0
--bg-gray: #f5f5f5
--white: #ffffff
```

### New CSS Classes
- `.main-nav` - Navigation bar
- `.nav-link` - Navigation links
- `.page-content` - Page wrapper
- `.single-result` - Single name result display
- `.swipe-card` - Swipeable card
- `.swipe-actions` - Action buttons
- `.dictionary-list` - Dictionary list view
- `.search-input` - Search bar
- And many more...

## Backend Changes
No backend changes required. All existing endpoints remain compatible:
- `POST /api/search` - Search names
- `GET /api/name/{name}` - Get name details
- `POST /api/random` - Get random name
- `GET /api/name-of-the-day` - Daily featured name
- `GET /api/traits` - Get trait categories

## User Flow

### Traditional Search
1. Go to Search page
2. Select gender
3. Adjust trait importance
4. Click "Search Names"
5. View ONE matching name with full details
6. Click to see more details in modal
7. Favorite or share from modal

### Discovery Mode
1. Go to Surprise page
2. Select gender (optional)
3. Swipe cards:
   - Right = Favorite ❤️
   - Left = Skip ❌
4. Or use buttons below card
5. Keep swiping to discover

### Dictionary Browse
1. Go to Dictionary page
2. Use search bar to find specific names/meanings
3. Filter by gender
4. Toggle favorites-only view
5. Click any name for full details
6. Favorite from list or modal

## Technical Details

### Dependencies Added
- `react-router-dom@7.14.0` - Client-side routing

### Swipe Implementation
- Touch events for mobile
- Mouse events for desktop
- 100px threshold for swipe detection
- Smooth CSS transitions
- Visual feedback (rotate + translate)

### State Management
- React hooks (useState, useEffect, useRef)
- localStorage for favorites persistence
- No external state management library

## Testing
- All 35 backend tests passing
- Frontend builds successfully
- Manual testing required for:
  - Swipe gestures (mobile)
  - Mouse drag (desktop)
  - Navigation between pages
  - Favorites persistence
  - Search functionality

## How to Run

### Backend
```bash
cd backend
python3 -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

Access at `http://localhost:3000`

## Future Enhancements
- Search history UI
- Name comparison view
- Export favorites
- Advanced filters in dictionary
- More swipe animations
- Pull to refresh
- Offline support
