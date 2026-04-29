import { Component, input, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { Extras, ItemCategory } from '../../models/mission.model';
import { CommonModule } from '@angular/common';

interface TextPart {
  text: string;
  missionId: string | null;
}

interface ParsedCategory extends ItemCategory {
  parts: TextPart[];
}

@Component({
  selector: 'app-extras-section',
  templateUrl: './extras-section.html',
  styleUrl: './extras-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '(document:keydown.escape)': 'closeLightbox()',
  },
})
export class ExtrasSection {
  readonly extras = input.required<Extras>();

  protected readonly parsedCategories = computed<ParsedCategory[]>(() => {
    const ipg = this.extras().itensParaGuardar;
    return [ipg.eletronicos, ipg.bensDomesticos].map(cat => ({
      ...cat,
      parts: this.parseText(cat.categoria),
    }));
  });

  // Lightbox para imagem de categoria
  protected readonly lightboxSrc = signal<string | null>(null);

  protected openImage(imageRef: string): void {
    this.lightboxSrc.set(imageRef);
  }

  protected closeLightbox(): void {
    this.lightboxSrc.set(null);
  }

  protected navigateToMission(event: Event, missionId: string): void {
    event.preventDefault();
    if (window.location.hash === `#${missionId}`) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = missionId;
    }
  }

  private parseText(text: string): TextPart[] {
    const match = text.match(/^([\s\S]*?)((?:Missão|ID da Missão):\s*'([^']+)')([\s\S]*)$/);
    if (!match) return [{ text, missionId: null }];

    const parts: TextPart[] = [];
    if (match[1]) parts.push({ text: match[1], missionId: null });
    parts.push({ text: match[2], missionId: match[3] });
    if (match[4]) parts.push({ text: match[4], missionId: null });
    return parts;
  }
}
