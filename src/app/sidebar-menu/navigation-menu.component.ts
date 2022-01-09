import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'het-navigation-menu',
  styles: [
    `
      i {
        font-size: 1rem;
      }

      nav {
        padding-top: 1rem;
        height: 100%;
        border-right: solid 1px #304562;
      }

      a {
        color: white;
        text-decoration: none;
        margin-left: 1rem;
      }

      .activeLink {
        font-weight: bold;
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
      <div fxLayout="column" fxLayoutGap="1rem">
        <het-language-switcher></het-language-switcher>
        <div fxLayout="column">
          <a routerLink="/dashboard" routerLinkActive="activeLink">
            <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="0.5em">
              <i class="pi pi-list"></i
              ><span>{{ 'Dashboard' | translate }}</span>
            </div>
          </a>
        </div>
        <a routerLink="logout" (click)="logout()">
          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="0.5em">
            <i class="pi pi-power-off"></i
            ><span>{{ 'Logout' | translate }}</span>
          </div>
        </a>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent {
  constructor(private readonly keycloakService: KeycloakService) {}

  public logout(): void {
    this.keycloakService.logout(environment.logoutRedirectUrl);
  }
}
