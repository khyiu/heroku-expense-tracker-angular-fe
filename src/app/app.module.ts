import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from './sidebar-menu/menu.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

const initializeKeycloak = (keycloak: KeycloakService): Function => {
  return () =>
    keycloak.init({
      config: {
        url: 'https://lemur-4.cloud-iam.com/auth',
        realm: 'kuritsu',
        clientId: 'expense-tracker',
      },
      initOptions: {
        onLoad: 'login-required',
      },
    });
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    SharedModule,
    MenuModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
