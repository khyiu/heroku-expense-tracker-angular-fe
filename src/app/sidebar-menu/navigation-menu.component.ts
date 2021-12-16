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
    `,
  ],
  template: `
    <nav>
      <div fxLayout="row" fxLayoutAlign="space-around">
        <a [routerLink]="'dashboard'">
          <p-image
            src="/assets/logo-monochrome-white.svg"
            alt="Expense Tracker logo"
            width="180"
          ></p-image>
        </a>
      </div>
      <p-divider></p-divider>
      <!--      todo: kyiu add a language switcher-->
      <div>{{ 'welcome' | translate }}</div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent {}
