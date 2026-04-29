import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  HostListener,
  afterRenderEffect,
} from '@angular/core';
import { MissionService } from './services/mission.service';
import { Header } from './components/header/header';
import { Controls } from './components/controls/controls';
import { QuickNav } from './components/quick-nav/quick-nav';
import { MissionBoard } from './components/mission-board/mission-board';
import { ExtrasSection } from './components/extras-section/extras-section';
import { MissionModal } from './components/mission-modal/mission-modal';
import { Toast } from './components/toast/toast';
import { Mission } from './models/mission.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    Header,
    Controls,
    QuickNav,
    MissionBoard,
    ExtrasSection,
    MissionModal,
    Toast,
  ],
})
export class App {
  protected readonly svc = inject(MissionService);
  protected readonly toastMsg = signal('');
  protected readonly showScrollBtn = signal(false);
  protected readonly modalMission = signal<Mission | null>(null);

  private deepLinkHandled = false;

  constructor() {
    this.svc.loadData();

    // Deep-link inicial: processa hash/path quando os dados estiverem carregados
    afterRenderEffect(() => {
      if (this.deepLinkHandled || !this.svc.data()) return;
      this.deepLinkHandled = true;
      this.handleDeepLink();
    });
  }

  @HostListener('window:hashchange')
  protected onHashChange(): void {
    if (!this.svc.data()) return;
    this.handleDeepLink();
  }

  protected openModal(id: string): void {
    const m = this.svc.allMissions().find((ms) => ms.id === id);
    if (m) this.modalMission.set(m);
  }

  protected closeModal(): void {
    this.modalMission.set(null);
  }

  protected showToast(msg: string): void {
    this.toastMsg.set('');
    // force signal update even for same message
    queueMicrotask(() => this.toastMsg.set(msg));
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.showScrollBtn.set(window.scrollY > 400);
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private handleDeepLink(): void {
    const parsed = this.parseDeepLinkFromUrl();
    if (!parsed) return;

    if (!parsed.missionId) {
      this.showToast(`Missão não existe: #${parsed.rawRef}`);
      return;
    }

    // espera leve para estabilizar layout (equalização de altura dos cards)
    setTimeout(() => this.scrollAndHighlight(parsed.missionId!), 120);
  }

  /**
   * Lê deep-link de hash (#p2-l1-m4 / #p2-l0-c3) ou path (/p2-l1-m4 / /p2-l0-c3).
   */
  private parseDeepLinkFromUrl(): { rawRef: string; missionId: string | null } | null {
    const hashRef = window.location.hash.replace(/^#/, '').trim().toLowerCase();
    const pathRef = window.location.pathname
      .split('/')
      .filter(Boolean)
      .at(-1)
      ?.trim()
      .toLowerCase();

    const candidate = hashRef || pathRef;
    if (!candidate) return null;
    if (!/^p\d+-l\d+-(?:c|m)\d+$/.test(candidate)) return null;

    const missionId = this.normalizeMissionRef(candidate);
    return { rawRef: candidate, missionId };
  }

  private normalizeMissionRef(ref: string): string | null {
    const all = this.svc.allMissions();

    // Formato JSON (0-indexed)
    if (/^p\d+-l\d+-c\d+$/.test(ref)) {
      return all.some((m) => m.id === ref) ? ref : null;
    }

    // Formato amigável (1-indexed)
    const match = ref.match(/^p(\d+)-l(\d+)-m(\d+)$/);
    if (!match) return null;
    const [, part, line, mission] = match;
    const jsonId = `p${part}-l${Number(line) - 1}-c${Number(mission) - 1}`;
    return all.some((m) => m.id === jsonId) ? jsonId : null;
  }

  private scrollAndHighlight(missionId: string): void {
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(missionId);
      if (!el) {
        if (attempt < 4) setTimeout(() => tryScroll(attempt + 1), 120);
        return;
      }

      const headerEl = document.querySelector<HTMLElement>('.header');
      const headerOffset = (headerEl?.getBoundingClientRect().height ?? 72) + 14;
      const targetTop = this.computeDeepLinkScrollTop(el, headerOffset);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const topOk = rect.top >= headerOffset - 4;
        const bottomOk = rect.bottom <= window.innerHeight - 10;

        if ((!topOk || !bottomOk) && attempt < 2) {
          tryScroll(attempt + 1);
          return;
        }

        el.classList.remove('neon-highlight');
        void el.getBoundingClientRect(); // force reflow to restart animation
        el.classList.add('neon-highlight');
        el.addEventListener('animationend', () => el.classList.remove('neon-highlight'), {
          once: true,
        });
      }, 420);
    };

    tryScroll();
  }

  private computeDeepLinkScrollTop(targetCard: HTMLElement, headerOffset: number): number {
    const targetAbsTop = window.scrollY + targetCard.getBoundingClientRect().top;

    // Preferência visual: alinhar o topo do card anterior logo abaixo do header,
    // deixando o card alvo mais ao centro da viewport.
    const lane = targetCard.closest('.lane-cards');
    if (lane) {
      const cards = Array.from(lane.querySelectorAll<HTMLElement>('.card'));
      const idx = cards.indexOf(targetCard);
      if (idx > 0) {
        const prev = cards[idx - 1];
        const prevAbsTop = window.scrollY + prev.getBoundingClientRect().top;
        return Math.max(0, prevAbsTop - headerOffset);
      }
    }

    // Fallback: centraliza o card alvo na área visível (descontando header)
    const available = window.innerHeight - headerOffset;
    const centerOffset = Math.max(0, (available - targetCard.offsetHeight) / 2);
    return Math.max(0, targetAbsTop - headerOffset - centerOffset);
  }
}
