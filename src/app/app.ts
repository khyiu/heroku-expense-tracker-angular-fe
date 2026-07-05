import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'het-root',
  imports: [RouterOutlet, TranslocoPipe],
  template: `
    <div>It's me, it's Mario {{ 'hello' | transloco }}</div>
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('kuritsu-expense-tracker-fe');
}
