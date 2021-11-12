import {Component} from '@angular/core';

@Component({
  selector: 'het-root',
  template: `
    <het-navigation-menu></het-navigation-menu>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

}
