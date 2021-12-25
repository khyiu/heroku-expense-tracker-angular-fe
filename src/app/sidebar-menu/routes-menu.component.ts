import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'het-routes-menu',
  template: `
    <nav>
      <a routerLink="/dashboard" routerLinkActive="activeLink">
        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="0.5em">
          <i class="pi pi-list"></i><span>{{ 'Dashboard' | translate }}</span>
        </div>
      </a>
    </nav>
  `,
  styles: [
    `
      a {
        color: white;
        text-decoration: none;
      }

      nav {
        margin: 1.5em 1.5em 1.5em
      }

      .activeLink {
        font-weight: bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesMenuComponent {}
