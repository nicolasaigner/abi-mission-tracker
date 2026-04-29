import { Component, input, output, ChangeDetectionStrategy, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly message = input.required<string>();
  readonly dismiss = output<void>();

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.dismiss.emit(), 3000);
    });
  }
}
