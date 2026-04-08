export interface NameProfile {
  name: string;
  gender: string;
  meaning: string;
  trait_scores: TraitScores;
  celebrities: string[];
}

export interface NameProfileWithScore extends NameProfile {
  match_score: number;
}

export interface TraitScores {
  beautiful: number;
  smart: number;
  strong: number;
  believer: number;
  rich: number;
  patience: number;
  merciful: number;
  honorable: number;
  generous: number;
  leadership: number;
  creative: number;
  wise: number;
}

export interface TraitInfo {
  key: keyof TraitScores;
  label: string;
  label_tatar: string;
}

export interface SearchRequest {
  gender: "male" | "female" | "both";
  traits: Partial<Record<keyof TraitScores, number>>;
  limit: number;
  search_query?: string;
  min_score?: number;
  has_celebrities?: boolean;
}

export interface SearchResponse {
  results: NameProfileWithScore[];
  total_matches: number;
}

export interface RandomNameRequest {
  gender: "male" | "female" | "both";
}

export interface RandomNameResponse {
  name: NameProfileWithScore;
}

export interface NameOfTheDayResponse {
  name: NameProfileWithScore;
  date: string;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: number;
  request: SearchRequest;
  result: NameProfileWithScore;
}

export interface FavoriteName {
  name: string;
  addedAt: number;
  profile: NameProfile;
}
