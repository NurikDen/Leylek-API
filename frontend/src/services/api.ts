import type {
  SearchRequest,
  SearchResponse,
  NameProfile,
  NameProfileWithScore,
  TraitInfo,
  RandomNameRequest,
  RandomNameResponse,
  NameOfTheDayResponse
} from '../types';

const API_BASE = '/api';

export async function getTraits(): Promise<TraitInfo[]> {
  const response = await fetch(`${API_BASE}/traits`);
  if (!response.ok) throw new Error('Failed to fetch traits');
  const data = await response.json();
  return data.traits;
}

export async function searchNames(request: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to search names');
  return response.json();
}

export async function getName(name: string): Promise<NameProfile> {
  const response = await fetch(`${API_BASE}/name/${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error('Failed to fetch name');
  return response.json();
}

export async function getRandomName(gender: "male" | "female" | "both"): Promise<RandomNameResponse> {
  const response = await fetch(`${API_BASE}/random`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gender }),
  });
  if (!response.ok) throw new Error('Failed to get random name');
  return response.json();
}

export async function getNameOfTheDay(): Promise<NameOfTheDayResponse> {
  const response = await fetch(`${API_BASE}/name-of-the-day`);
  if (!response.ok) throw new Error('Failed to get name of the day');
  return response.json();
}

export async function getDictionary(gender: "male" | "female" | "both", searchQuery?: string): Promise<{ names: NameProfileWithScore[], total: number }> {
  const response = await fetch(`${API_BASE}/dictionary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      gender,
      search_query: searchQuery || null,
      has_celebrities: false
    }),
  });
  if (!response.ok) throw new Error('Failed to get dictionary');
  return response.json();
}

// Local storage utilities for search history and favorites
export const searchHistory = {
  get: (): Array<{ timestamp: number; request: SearchRequest; result: any }> => {
    try {
      const data = localStorage.getItem('leylek_search_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  add: (request: SearchRequest, result: any) => {
    try {
      const history = searchHistory.get();
      history.unshift({
        timestamp: Date.now(),
        request,
        result
      });
      // Keep only last 20 searches
      localStorage.setItem('leylek_search_history', JSON.stringify(history.slice(0, 20)));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  },
  clear: () => {
    localStorage.removeItem('leylek_search_history');
  }
};

export const favorites = {
  get: (): Array<{ name: string; addedAt: number; profile: NameProfile }> => {
    try {
      const data = localStorage.getItem('leylek_favorites');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  add: (profile: NameProfile) => {
    try {
      const favs = favorites.get();
      // Don't add duplicates
      if (!favs.some(f => f.name === profile.name)) {
        favs.unshift({
          name: profile.name,
          addedAt: Date.now(),
          profile
        });
        localStorage.setItem('leylek_favorites', JSON.stringify(favs));
      }
    } catch (error) {
      console.error('Failed to save favorite:', error);
    }
  },
  remove: (name: string) => {
    try {
      const favs = favorites.get();
      const filtered = favs.filter(f => f.name !== name);
      localStorage.setItem('leylek_favorites', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },
  isFavorite: (name: string): boolean => {
    return favorites.get().some(f => f.name === name);
  },
  clear: () => {
    localStorage.removeItem('leylek_favorites');
  }
};
