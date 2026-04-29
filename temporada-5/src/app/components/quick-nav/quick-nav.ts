import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-quick-nav',
  templateUrl: './quick-nav.html',
  styleUrl: './quick-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickNav {
  protected readonly svc = inject(MissionService);
  protected readonly data = this.svc.data;

  protected scrollTo(partId: string): void {
    document.getElementById(partId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
