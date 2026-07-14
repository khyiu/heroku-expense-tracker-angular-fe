import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'het-root',
  imports: [RouterOutlet],
  template: `
    <h1>{{'Hello, ' + title()}}</h1>
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('kuritsu-expense-tracker-fe');
}
