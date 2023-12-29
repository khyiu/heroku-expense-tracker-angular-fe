import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  KeycloakAngularModule,
  KeycloakBearerInterceptor,
  KeycloakService,
} from 'keycloak-angular';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { Features } from './app/store/stores';
import { expenseReducer } from './app/store/expense/expense.reducers';
import { EffectsModule } from '@ngrx/effects';
import { ExpenseEffects } from './app/store/expense/expense.effects';
import { ExpenseFacade } from './app/store/expense/expense.facade';
import { BASE_PATH } from './app/generated-sources/expense-api';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

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
function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/*
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
 */

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakService,
    MessageService,
    {
      provide: BASE_PATH,
      useValue: environment.apiBasePath,
    },
    importProvidersFrom(
      KeycloakAngularModule,
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
      StoreModule.forRoot({ [Features.EXPENSE]: expenseReducer }),
      EffectsModule.forRoot([ExpenseEffects]),
      BrowserModule,
      BrowserAnimationsModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    KeycloakBearerInterceptor,
    ExpenseFacade,
  ],
});
