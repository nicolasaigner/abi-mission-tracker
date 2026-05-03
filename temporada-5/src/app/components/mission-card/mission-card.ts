import { Component, input, output, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Mission, ObjectiveProgress, parseQuantity } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.html',
  styleUrl: './mission-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionCard {
  private readonly svc = inject(MissionService);

  readonly mission = input.required<Mission>();
  readonly openModal = output<string>();
  readonly toastMsg = output<string>();

  protected readonly done = computed(() => this.svc.isCompleted(this.mission().id));

  protected readonly mapColor = computed(() => MissionService.mapColor(this.mission().localizacao));

  protected readonly objProgress = computed<ObjectiveProgress[]>(() => {
    const m = this.mission();
    const stored = this.svc.getObjectiveProgress(m.id);
    if (stored.length) return stored;
    // Fallback before init completes
    const isDone = this.svc.isCompleted(m.id);
    return m.objetivos.map((obj) => {
      const target = parseQuantity(obj);
      return { checked: isDone, current: isDone ? target : 0, target };
    });
  });

  protected toggle(): void {
    this.svc.toggleMission(this.mission().id);
  }

  protected toggleObjective(event: Event, index: number): void {
    const m = this.mission();
    this.svc.toggleObjective(m.id, index, m.objetivos);
  }

  protected updateCount(event: Event, index: number): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(value)) return;
    const m = this.mission();
    this.svc.updateObjectiveCount(m.id, index, value, m.objetivos);
  }

  protected increment(index: number): void {
    const prog = this.objProgress()[index];
    if (!prog || prog.current >= prog.target) return;
    const m = this.mission();
    this.svc.updateObjectiveCount(m.id, index, prog.current + 1, m.objetivos);
  }

  protected decrement(index: number): void {
    const prog = this.objProgress()[index];
    if (!prog || prog.current <= 0) return;
    const m = this.mission();
    this.svc.updateObjectiveCount(m.id, index, prog.current - 1, m.objetivos);
  }

  protected open(): void {
    this.openModal.emit(this.mission().id);
  }

  protected async shareMission(): Promise<void> {
    const id = this.mission().id;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const ok = await this.copyToClipboard(url);
    if (ok) {
      this.toastMsg.emit(`Link da missão copiado: #${id}`);
      return;
    }

    this.toastMsg.emit(`Não foi possível copiar automaticamente. ID da missão: ${id}`);
  }

  private async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
