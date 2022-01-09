import { Component } from '@angular/core';

@Component({
  selector: 'het-root',
  styles: [
    `
      #menuContainer {
        width: 220px;
      }

      #bodyContainer {
        width: calc(100% - 220px);
      }
    `,
  ],
  template: `
    <div fxLayout="column" fxFlexFill>
      <div fxFlex="100" fxLayout="row">
        <div id="menuContainer">
          <het-navigation-menu></het-navigation-menu>
        </div>
        <div id="bodyContainer">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {}
