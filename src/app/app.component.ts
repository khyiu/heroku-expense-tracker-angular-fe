import { Component } from '@angular/core';

@Component({
  selector: 'het-root',
  template: `
    <div fxLayout="column" fxFlexFill>
      <div fxFlex="100" fxLayout="row">
        <het-navigation-menu></het-navigation-menu>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {}
