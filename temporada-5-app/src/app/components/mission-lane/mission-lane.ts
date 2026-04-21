import { Component, input, inject, computed, output, ChangeDetectionStrategy } from '@angular/core';
import { Trilha } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';
import { MissionCard } from '../mission-card/mission-card';

@Component({
  selector: 'app-mission-lane',
  templateUrl: './mission-lane.html',
  styleUrl: './mission-lane.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionCard],
})
export class MissionLane {
  protected readonly svc = inject(MissionService);

  readonly trilha = input.required<Trilha>();
  readonly laneName = input.required<string>();
  readonly openModal = output<string>();
  readonly toastMsg = output<string>();

  protected readonly filteredMissions = computed(() =>
    this.trilha().missoes.filter((m) => this.svc.passesFilter(m)),
  );

  protected readonly laneCompleted = computed(() => {
    const t = this.trilha();
    return t.missoes.every((m) => this.svc.isCompleted(m.id));
  });
}
