import {Component} from '@angular/core';

@Component({
  selector: 'het-root',
  template: `
    <het-sidebar-navigation-menu></het-sidebar-navigation-menu>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

}
