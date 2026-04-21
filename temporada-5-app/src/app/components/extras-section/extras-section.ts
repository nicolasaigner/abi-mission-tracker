import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Extras, ItemCategory } from '../../models/mission.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-extras-section',
  templateUrl: './extras-section.html',
  styleUrl: './extras-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ExtrasSection {
  readonly extras = input.required<Extras>();

  protected readonly categories = computed<ItemCategory[]>(() => {
    const ipg = this.extras().itensParaGuardar;
    return [ipg.eletronicos, ipg.bensDomesticos];
  });
}
