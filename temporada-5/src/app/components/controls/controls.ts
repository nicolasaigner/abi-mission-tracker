import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../services/mission.service';
import { StatusFilter } from '../../models/mission.model';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.html',
  styleUrl: './controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class Controls {
  private readonly svc = inject(MissionService);

  protected readonly filter = this.svc.filter;
  protected readonly maps = this.svc.mapLocations;

  readonly toastMsg = output<string>();

  protected searchValue = '';

  protected setStatus(status: StatusFilter): void {
    this.svc.updateFilter({ status });
  }

  protected setMap(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.svc.updateFilter({ map: value });
  }

  protected toggleTeam(): void {
    this.svc.updateFilter({ teamOnly: !this.filter().teamOnly });
  }

  protected onSearch(value: string): void {
    this.searchValue = value;
    this.svc.updateFilter({ search: value });
  }

  protected exportProgress(): void {
    this.svc.exportProgress();
    this.toastMsg.emit('Progresso exportado!');
  }

  protected resetProgress(): void {
    if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
      this.svc.resetProgress();
      this.toastMsg.emit('Progresso resetado!');
    }
  }
}
