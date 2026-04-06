import type { SearchRequest, SearchResponse, NameProfile, TraitInfo } from '../types';

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
