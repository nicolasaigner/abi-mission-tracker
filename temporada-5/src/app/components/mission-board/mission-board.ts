import {
  Component,
  input,
  inject,
  output,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  afterRenderEffect,
} from '@angular/core';
import { Part, Trilha } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';
import { MissionLane } from '../mission-lane/mission-lane';
import { MissionCard } from '../mission-card/mission-card';

@Component({
  selector: 'app-mission-board',
  templateUrl: './mission-board.html',
  styleUrl: './mission-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionLane, MissionCard],
})
export class MissionBoard {
  protected readonly svc = inject(MissionService);
  private readonly el = inject(ElementRef);

  readonly part = input.required<Part>();
  readonly openModal = output<string>();
  readonly toastMsg = output<string>();

  protected readonly laneNames = MissionService.laneNames();

  /** Usa CSS Grid com grid-row explícito quando não há filtro ativo e há dados de row */
  protected readonly useGridLayout = computed(() => {
    const f = this.svc.filter();
    const noFilter = f.status === 'all' && f.map === 'all' && !f.search && !f.teamOnly;
    return (
      noFilter && this.part().trilhas.some((t) => t.missoes.some((m) => m.row !== undefined))
    );
  });

  protected isLaneDone(trilha: Trilha): boolean {
    return trilha.missoes.every((m) => this.svc.isCompleted(m.id));
  }

  constructor() {
    afterRenderEffect(() => {
      this.svc.filter();
      this.svc.completedIds();
      this.part();
      // syncCardHeights só é necessário no modo sequencial (com filtro)
      if (!this.useGridLayout()) this.syncCardHeights();
    });
  }

  private syncCardHeights(): void {
    const boardEl: HTMLElement = this.el.nativeElement;
    const laneEls = Array.from(boardEl.querySelectorAll('app-mission-lane'));
    if (laneEls.length === 0) return;

    const laneCards = laneEls.map((lane) =>
      Array.from(lane.querySelectorAll<HTMLElement>('.card')),
    );
    const maxCards = Math.max(...laneCards.map((c) => c.length));

    for (let i = 0; i < maxCards; i++) {
      const rowCards = laneCards.map((cards) => cards[i]).filter((c): c is HTMLElement => !!c);
      rowCards.forEach((c) => (c.style.minHeight = ''));
      const maxH = Math.max(...rowCards.map((c) => c.getBoundingClientRect().height));
      rowCards.forEach((c) => (c.style.minHeight = `${maxH}px`));
    }
  }
}
