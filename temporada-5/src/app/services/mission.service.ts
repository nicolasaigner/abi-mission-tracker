import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MissionData,
  Mission,
  Part,
  FilterState,
  StatusFilter,
  ObjectiveProgress,
  parseQuantity,
  Acknowledgments,
} from '../models/mission.model';

const STORAGE_KEY = 'abi-tracker-s5';
const OBJ_STORAGE_KEY = 'abi-tracker-s5-obj';
const LANE_NAMES = ['Trilha Superior', 'Trilha Central', 'Trilha Inferior'];
const MAP_COLORS: Record<string, string> = {
  Fazenda: '#84cc16',
  Arsenal: '#f97316',
  Aeroporto: '#3b82f6',
  'Vale Distorcido': '#a855f7',
  'Estação de TV': '#ec4899',
  Northridge: '#22d3ee',
  Múltiplos: '#eab308',
  Todos: '#94a3b8',
};

@Injectable({ providedIn: 'root' })
export class MissionService {
  private readonly http = inject(HttpClient);

  readonly data = signal<MissionData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly completedIds = signal<Set<string>>(this.loadFromStorage());
  readonly objectiveProgress = signal<Record<string, ObjectiveProgress[]>>(
    this.loadObjectivesFromStorage(),
  );
  readonly filter = signal<FilterState>({
    status: 'all',
    map: 'all',
    search: '',
    teamOnly: false,
  });

  readonly allMissions = computed<Mission[]>(() => {
    const d = this.data();
    if (!d) return [];
    const out: Mission[] = [];
    for (const part of d.partes) {
      for (const trilha of part.trilhas) {
        out.push(...trilha.missoes);
      }
    }
    return out;
  });

  readonly totalCount = computed(() => this.allMissions().length);

  readonly doneCount = computed(() => {
    const all = this.allMissions();
    const done = this.completedIds();
    return all.filter((m) => done.has(m.id)).length;
  });

  readonly progressPercent = computed(() => {
    const total = this.totalCount();
    return total > 0 ? Math.round((this.doneCount() / total) * 100) : 0;
  });

  readonly mapLocations = computed<string[]>(() => {
    const d = this.data();
    if (!d) return [];
    return Object.values(d.localizacoes);
  });

  static laneNames(): readonly string[] {
    return LANE_NAMES;
  }

  static mapColor(location: string): string {
    return MAP_COLORS[location] ?? '#94a3b8';
  }

  loadData(): void {
    this.http.get<MissionData>('missoes.json').subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
        this.initAllObjectiveProgress(this.allMissions());
      },
      error: (err) => {
        this.error.set(String(err.message ?? err));
        this.loading.set(false);
      },
    });
  }

  toggleMission(id: string): void {
    const wasCompleted = this.completedIds().has(id);
    this.completedIds.update((set) => {
      const next = new Set(set);
      if (wasCompleted) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    this.saveToStorage();

    // Sync all objectives when toggling the whole mission
    const progress = this.objectiveProgress()[id];
    if (progress) {
      const marking = !wasCompleted;
      this.objectiveProgress.update((p) => ({
        ...p,
        [id]: progress.map((obj) => ({
          ...obj,
          checked: marking,
          current: marking ? obj.target : 0,
        })),
      }));
      this.saveObjectivesToStorage();
    }
  }

  isCompleted(id: string): boolean {
    return this.completedIds().has(id);
  }

  updateFilter(partial: Partial<FilterState>): void {
    this.filter.update((f) => ({ ...f, ...partial }));
  }

  passesFilter(mission: Mission): boolean {
    const f = this.filter();
    const done = this.completedIds().has(mission.id);

    if (f.status === 'completed' && !done) return false;
    if (f.status === 'pending' && done) return false;
    if (f.map !== 'all' && mission.localizacao !== f.map) return false;
    if (f.teamOnly && !mission.missaoDeEquipe) return false;

    if (f.search) {
      const haystack = [
        mission.id,
        mission.titulo,
        mission.observacao,
        mission.localizacao,
        ...mission.objetivos,
        mission.dicas ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(f.search.toLowerCase())) return false;
    }

    return true;
  }

  partDone(part: Part): number {
    const done = this.completedIds();
    let count = 0;
    for (const t of part.trilhas) {
      for (const m of t.missoes) {
        if (done.has(m.id)) count++;
      }
    }
    return count;
  }

  partTotal(part: Part): number {
    let count = 0;
    for (const t of part.trilhas) {
      count += t.missoes.length;
    }
    return count;
  }

  resetProgress(): void {
    this.completedIds.set(new Set());
    this.objectiveProgress.set({});
    this.saveToStorage();
    this.saveObjectivesToStorage();
  }

  exportProgress(): void {
    const payload = {
      season: 5,
      exported: new Date().toISOString(),
      completed: Array.from(this.completedIds()),
      objectives: this.objectiveProgress(),
      total: this.totalCount(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abi-tracker-s5-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa progresso de um JSON exportado. Mescla com o progresso atual
   * (pode mudar para sobrescrever via parâmetro). Retorna stats da operação.
   */
  async importProgress(file: File): Promise<{ completed: number; objectives: number }> {
    const text = await file.text();
    const parsed: unknown = JSON.parse(text);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Arquivo inválido: estrutura JSON não reconhecida.');
    }

    const data = parsed as {
      season?: number;
      completed?: unknown;
      objectives?: unknown;
    };

    if (data.season !== undefined && data.season !== 5) {
      throw new Error(`Arquivo é da temporada ${data.season}, esperado temporada 5.`);
    }

    // Validação e parsing de completed
    if (!Array.isArray(data.completed)) {
      throw new Error('Arquivo inválido: campo "completed" ausente ou inválido.');
    }
    const completedArr = data.completed.filter((v): v is string => typeof v === 'string');

    // Validação de objectives
    if (
      !data.objectives ||
      typeof data.objectives !== 'object' ||
      Array.isArray(data.objectives)
    ) {
      throw new Error('Arquivo inválido: campo "objectives" ausente ou inválido.');
    }
    const objectivesObj = data.objectives as Record<string, ObjectiveProgress[]>;

    this.completedIds.set(new Set(completedArr));
    this.objectiveProgress.set(objectivesObj);
    this.saveToStorage();
    this.saveObjectivesToStorage();

    return {
      completed: completedArr.length,
      objectives: Object.keys(objectivesObj).length,
    };
  }

  // ── Objective-level tracking ──────────────────────────────────

  getObjectiveProgress(missionId: string): ObjectiveProgress[] {
    return this.objectiveProgress()[missionId] ?? [];
  }

  toggleObjective(missionId: string, objIndex: number, objectives: string[]): void {
    this.objectiveProgress.update((p) => {
      const cloned = { ...p };
      if (!cloned[missionId]) {
        cloned[missionId] = objectives.map((o) => ({
          checked: false,
          current: 0,
          target: parseQuantity(o),
        }));
      }
      const arr = [...cloned[missionId]];
      const obj = { ...arr[objIndex] };
      obj.checked = !obj.checked;
      if (obj.target > 0) {
        obj.current = obj.checked ? obj.target : 0;
      }
      arr[objIndex] = obj;
      cloned[missionId] = arr;
      return cloned;
    });
    this.saveObjectivesToStorage();
    this.checkAutoComplete(missionId);
  }

  updateObjectiveCount(
    missionId: string,
    objIndex: number,
    value: number,
    objectives: string[],
  ): void {
    this.objectiveProgress.update((p) => {
      const cloned = { ...p };
      if (!cloned[missionId]) {
        cloned[missionId] = objectives.map((o) => ({
          checked: false,
          current: 0,
          target: parseQuantity(o),
        }));
      }
      const arr = [...cloned[missionId]];
      const obj = { ...arr[objIndex] };
      obj.current = Math.max(0, Math.min(value, obj.target));
      obj.checked = obj.current >= obj.target;
      arr[objIndex] = obj;
      cloned[missionId] = arr;
      return cloned;
    });
    this.saveObjectivesToStorage();
    this.checkAutoComplete(missionId);
  }

  // ── Private helpers ───────────────────────────────────────────

  private initAllObjectiveProgress(missions: Mission[]): void {
    const existing = this.objectiveProgress();
    const updated = { ...existing };
    let changed = false;
    for (const m of missions) {
      if (!updated[m.id]) {
        const isDone = this.completedIds().has(m.id);
        updated[m.id] = m.objetivos.map((obj) => {
          const target = parseQuantity(obj);
          return { checked: isDone, current: isDone ? target : 0, target };
        });
        changed = true;
      }
    }
    if (changed) {
      this.objectiveProgress.set(updated);
      this.saveObjectivesToStorage();
    }
  }

  private checkAutoComplete(missionId: string): void {
    const progress = this.objectiveProgress()[missionId];
    if (!progress?.length) return;
    const allDone = progress.every((p) => p.checked);
    const isCompleted = this.completedIds().has(missionId);
    if (allDone && !isCompleted) {
      this.completedIds.update((set) => {
        const next = new Set(set);
        next.add(missionId);
        return next;
      });
      this.saveToStorage();
    } else if (!allDone && isCompleted) {
      this.completedIds.update((set) => {
        const next = new Set(set);
        next.delete(missionId);
        return next;
      });
      this.saveToStorage();
    }
  }

  private loadFromStorage(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr: unknown = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return new Set(arr.filter((v): v is string => typeof v === 'string'));
        }
      }
    } catch {
      // ignore corrupt data
    }
    return new Set();
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.completedIds())));
  }

  private loadObjectivesFromStorage(): Record<string, ObjectiveProgress[]> {
    try {
      const raw = localStorage.getItem(OBJ_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as Record<string, ObjectiveProgress[]>;
        }
      }
    } catch {
      // ignore corrupt data
    }
    return {};
  }

  private saveObjectivesToStorage(): void {
    localStorage.setItem(OBJ_STORAGE_KEY, JSON.stringify(this.objectiveProgress()));
  }

  private acknowledgments(): Acknowledgments[] {
    return this.data()?.acknowledgments ?? [];
  }
}
