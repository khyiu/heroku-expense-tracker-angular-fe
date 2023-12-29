import { Component } from '@angular/core';
import {ToastModule} from 'primeng/toast';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NavigationMenuComponent} from './sidebar-menu/navigation-menu.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'het-root',
  standalone: true,
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
    <p-toast position="top-right"></p-toast>
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
  imports: [
    ToastModule,
    FlexLayoutModule,
    NavigationMenuComponent,
    RouterOutlet,
  ],
})
export class AppComponent {}
