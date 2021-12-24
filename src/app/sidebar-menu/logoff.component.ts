import { ChangeDetectionStrategy, Component } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';

@Component({
  selector: 'het-logoff',
  template: `
    <button
      pButton
      pRipple
      type="button"
      icon="pi pi-power-off"
      class="p-button-rounded p-button-outlined"
      label="{{ 'Logout' | translate }}"
      (click)="logout()"
    ></button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoffComponent {

  constructor(private readonly keycloakService: KeycloakService) {
  }

  public logout(): void {
    this.keycloakService.logout(environment.logoutRedirectUrl);
  }
}
