import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from './sidebar-menu/menu.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SharedModule } from './shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ExpenseNgRxModule } from './store/expense/expense.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const initializeKeycloak = (keycloak: KeycloakService): Function => {
  return () =>
    keycloak.init({
      config: {
        url: 'https://lemur-18.cloud-iam.com/auth',
        realm: 'kuritsu',
        clientId: 'expense-tracker',
      },
      initOptions: {
        onLoad: 'login-required',
      },
    });
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    ExpenseNgRxModule.forRoot(environment.apiBasePath),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ToastModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
