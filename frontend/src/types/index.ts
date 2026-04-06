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
}

export interface SearchResponse {
  results: NameProfileWithScore[];
  total_matches: number;
}
