import {
  Component,
  input,
  inject,
  output,
  ChangeDetectionStrategy,
  ElementRef,
  afterRenderEffect,
} from '@angular/core';
import { Part } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';
import { MissionLane } from '../mission-lane/mission-lane';

@Component({
  selector: 'app-mission-board',
  templateUrl: './mission-board.html',
  styleUrl: './mission-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionLane],
})
export class MissionBoard {
  protected readonly svc = inject(MissionService);
  private readonly el = inject(ElementRef);

  readonly part = input.required<Part>();
  readonly openModal = output<string>();
  readonly toastMsg = output<string>();

  protected readonly laneNames = MissionService.laneNames();

  constructor() {
    afterRenderEffect(() => {
      // Track signals that affect card visibility/content
      this.svc.filter();
      this.svc.completedIds();
      this.part();
      this.syncCardHeights();
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

      // Reset to measure natural height
      rowCards.forEach((c) => (c.style.minHeight = ''));

      const maxH = Math.max(...rowCards.map((c) => c.getBoundingClientRect().height));
      rowCards.forEach((c) => (c.style.minHeight = `${maxH}px`));
    }
  }
}
