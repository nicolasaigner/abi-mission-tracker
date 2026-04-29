import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly svc = inject(MissionService);

  protected readonly doneCount = this.svc.doneCount;
  protected readonly totalCount = this.svc.totalCount;
  protected readonly progressPercent = this.svc.progressPercent;

  protected readonly dashArray = computed(() => `${this.progressPercent()}, 100`);
}
