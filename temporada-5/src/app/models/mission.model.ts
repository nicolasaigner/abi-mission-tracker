export interface MissionData {
  season: number;
  acknowledgments?: Acknowledgments[];
  name: string;
  language: string;
  source: MissionSource;
  localizacoes: Record<string, string>;
  zonas: Record<string, string>;
  partes: Part[];
  extras?: Extras;
}

export interface Acknowledgments {
  name: string;
  social_media: SocialMedia[];
  contributions: string;
}

export interface SocialMedia {
  link: string;
  type: string;
}

export interface MissionSource {
  original: string;
  traducao: string;
  referencia: string;
}

export interface Part {
  id: string;
  nome: string;
  trilhas: Trilha[];
}

export interface Trilha {
  trilha: number;
  missoes: Mission[];
}

export interface Mission {
  id: string;
  titulo?: string;
  coluna: number;
  row?: number;
  localizacao: string;
  missaoDeEquipe: boolean;
  recomendadoPular: boolean;
  objetivos: string[];
  dicas: string;
  itensNecessarios?: string[];
  observacao?: string;
  images?: { src: string; alt: string }[];
  mapa_interativo?: string[];
}

export interface Extras {
  itensParaGuardar: ItensParaGuardar;
  vale_distorcido?: ValeDistorcido;
}

export interface ItensParaGuardar {
  descricao: string;
  eletronicos: ItemCategory;
  bensDomesticos: ItemCategory;
}

export interface ItemCategory {
  quantidade: number;
  qualidadeMinima?: string;
  categoria: string;
  image_ref?: string;
  itens: string[];
}

export interface ValeDistorcido {
  descricao: string;
  mecanicas: string[];
}

export interface ObjectiveProgress {
  checked: boolean;
  current: number;
  target: number; // 0 = checkbox only, >1 = counter
}

/** Extract a countable quantity from an objective's text. Returns 0 for checkbox-only. */
export function parseQuantity(text: string): number {
  let clean = text.replace(/^\[Equipe\]\s*/, '');

  // "Progresso" objectives have a point-based scoring format — no explicit total
  if (/\(Progresso:/i.test(clean)) return 0;

  // Strip non-quantity numbers (item names, currency, time)
  clean = clean.replace(/\bnº\s*\d+/gi, '');
  clean = clean.replace(/\bMk\s*\d+/gi, '');
  clean = clean.replace(/\bT-\d+/gi, '');
  clean = clean.replace(/\bCOM\d+/gi, '');
  clean = clean.replace(/\bGS\d+/gi, '');
  clean = clean.replace(/\bClasse\s+\d+/gi, '');
  clean = clean.replace(/\b\d{1,3}(?:\.\d{3})+\b/g, ''); // currency (750.000)
  clean = clean.replace(/por\s+\d+\s+segundos/gi, ''); // time durations

  const match = clean.match(/\b(\d+)\b/);
  if (match) {
    const n = parseInt(match[1], 10);
    return n > 1 ? n : 0;
  }
  return 0;
}

export type StatusFilter = 'all' | 'pending' | 'completed';

export interface FilterState {
  status: StatusFilter;
  map: string;
  search: string;
  teamOnly: boolean;
}
