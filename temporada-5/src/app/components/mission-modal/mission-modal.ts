import {
  Component,
  input,
  output,
  inject,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { Mission } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-mission-modal',
  templateUrl: './mission-modal.html',
  styleUrl: './mission-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close.emit()',
  },
})
export class MissionModal {
  private readonly svc = inject(MissionService);

  readonly mission = input.required<Mission>();
  readonly close = output<void>();

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  protected readonly done = computed(() => this.svc.isCompleted(this.mission().id));

  protected readonly mapColor = computed(() => MissionService.mapColor(this.mission().localizacao));

  constructor() {
    afterNextRender(() => {
      this.dialog()?.nativeElement.focus();
    });
  }

  protected toggle(): void {
    this.svc.toggleMission(this.mission().id);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  protected openImage(src: string): void {
    window.open(src, '_blank');
  }
}
