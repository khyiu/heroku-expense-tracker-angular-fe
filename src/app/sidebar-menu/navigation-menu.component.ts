import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'het-navigation-menu',
  styles: [
    `
      i {
        font-size: 1rem;
      }

      nav {
        padding-top: 1rem;
        width: 220px;
        height: 100%;
        border-right: solid 1px #304562;
      }

      #logoff-container {
        width: 220px;
        position: fixed;
        bottom: 1rem;
      }
    `,
  ],
  template: `
    <nav>
      <div fxLayout="row" fxLayoutAlign="space-around">
        <a [routerLink]="'dashboard'" tabindex="0">
          <p-image
            src="/assets/logo-monochrome-white.svg"
            alt="Expense Tracker logo"
            width="180"
          ></p-image>
        </a>
      </div>
      <p-divider></p-divider>
      <het-language-switcher></het-language-switcher>
      <het-routes-menu></het-routes-menu>
      <div id="logoff-container">
        <div fxLayout="row" fxLayoutAlign="center">
          <het-logoff></het-logoff>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent {}
