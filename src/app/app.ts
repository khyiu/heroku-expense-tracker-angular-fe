import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'het-root',
  imports: [RouterOutlet],
  template: `
    <div>It's me, it's Mario</div>
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('kuritsu-expense-tracker-fe');
}
