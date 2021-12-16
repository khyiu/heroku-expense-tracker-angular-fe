# HerokuExpenseTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Journey log

## 1. CI using CircleCI

At the root of the project, create a folder named `.circleci`.  
Inside this folder, create a `config.yml` file. This configuration specifies the steps that must be executed on CircleCI when changes are pushed to the `main` branch.

## 2. CD: Deploy app on Heroku from CircleCI

1. Create an app on Heroku
2. At the root of the project, create a file named ´server.js`.  
   This file defines a NodeJS app that will start an Express JS server to serve the content from the distribution folder of the Angular app.
   ``` Javascript
    const express = require('express');
    const app = express();
    
    app.use(express.static('./dist/heroku-expense-tracker'));
    app.listen(process.env.PORT || 8080);

    ```
3. Add `ExpressJS` to the NPM dependencies
   ``` Json
    "dependencies": {
       "express": "^4.17.1",
     },
   ```
   As our Node JS app starts an ExpressJS server, this dependency is necessary

4. The actual deployment to Heroku is done using the `circleci/heroku` orb. By importing this orb in our CircleCI config, we'll get access to the `heroku/deploy-via-git` job. We only need to specify
   the Heroku API key, the application name on Heroku server and the branch to deploy.

## 3. Components library

The components I'll be using for this project is [PrimeNG](https://www.primefaces.org/primeng/showcase/#/). Although this library might not have the best look and feel when compared to some other
components libraries, I've chosen it because it is also available for VueJS. This will help to make a fair comparison between VueJS and Angular in a future project.

Installation:

```bash
$ npm install --save primeng
```

## 4. Layout and theming

1. Icons library from PrimeNG:
   ```bash
   $ npm install --save primeicons 
   ```
2. Grid/Flexbox/... library:
   ```bash
   $ npm install --save primeflex
   ```
3. Import the theming, layout and icons scss resources by adding the following lines in `styles.scss
   ```scss
   @import "primeicons/primeicons.css";
   @import "primeng/resources/primeng.min.css";
   @import "primeng/resources/themes/vela-orange/theme.css";
   @import 'primeflex/primeflex.scss';
   ```

## 5. Linting

Since TSLint has been deprecated in favor of ESLint, I'll be using the latter. I've also chosen the shared configuration from Google. For more
details: [Google ESLint](https://github.com/google/eslint-config-google)

Installation and configuration:

Add Angular ESLint schematics by running the following command:

   ```bash
   $ ng add @angular-eslint/schematics
   ```

This will install the necessary NPM dependencies and create the default `.eslintrc.json` file.

## 6. Layout: replacing Primeflex with Angular FlexLayout

Angular FlexLayout seems easier and more intuitive to use. So, let's replace Primeflex...

1. Uninstall Primeflex by running this command:
   ```bash
   $ npm uninstall primeflex
   ```
2. Remove stylesheet import: in the `styles.scss` file, remove the following statement:
   ```scss
   @import 'primeflex/primeflex.scss';
   ```
3. Install and import Angular FlexLayout by following the instructions indicated in the [Angular FlexLayout project documentation](https://github.com/angular/flex-layout)

## 7. Integrate a Keycloak adapter

In order to integrate Keycloak in my front-end app, I figured I'll give the `keycloak-angular` NPM library a shot.  
The library and its setup instructions can be found [here](https://www.npmjs.com/package/keycloak-angular#installation)

Here are the steps I went through:

1. Add the npm dependency to the project
   ```bash
   $ npm install keycloak-angular keycloak-js
   ```

2. Initialize Keycloak during bootstrapping of the Angular app.  
   In `app.module.ts`, define a function that receives an instance of `KeycloakService`, and returns itself, a function that will be invoked when Angular injects the `APP_INITIALIZER` token:
   ```typescript
   const initializeKeycloak = (keycloak: KeycloakService): Function => {
    return () =>
        keycloak.init({
            config: { 
                url: 'https://lemur-4.cloud-iam.com/auth', 
                realm: 'kuritsu', clientId: 'expense-tracker', 
            }, 
            initOptions: {
                onLoad: 'login-required', 
            }, 
        });
    };
   ```
   The `onLoad` properties set to `login-required` will redirect the user to the Keycloak login page if he's not logged in at application initialization.  
   Then, add the following provider to have this function executed during application initilization:
   ```typescript
   {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
   ```
3. In Keycloak admin console, define which URLs can be used as redirection target, after the user successfully logged in:

   ![Keycloak config](./doc/Keycloak%20redirect%20URLs%20+%20CORS.png)

   By setting `Web origins` to "+", CORS is enabled for all valid redirect URLs.  
   Without this bit of configuration, when the user is logged in, redirection will fail with an HTTP 401 status code.

## 8. Generate client from Openapi definition

1. Install "openapi-generator-cli"
   ```bash
   $ npm install @openapitools/openapi-generator-cli --dev
   ```
2. Generate client code
   ```bash
   $ openapi-generator-cli generate -i https://raw.githubusercontent.com/khyiu/heroku-expense-tracker-api/master/src/main/resources/heroku-expense-tracker-api.yaml -g typescript-angular -o src/app/generated-sources/expense-api --additional-properties=ngVersion=12.2.0,supportsES6=true,npmVersion=8.1.0,withInterfaces=true
   ```

## 9. Integrate NgRx

1. Dependencies to add:

   ```bash
   # NgRx
   $ npm install @ngrx/store --save
   # Add support of EntityAdapter
   $ npm install @ngrx/entity --save
   # Add support of Effects
   $ npm install @ngrx/effects --save
   ```

2. Install NgRx Store DevTool so that we can inspect stores using Chrome/Firefox NgRx DevTool extension

   ``` bash
   $ ng add @ngrx/store-devtools
   ```

   This command will also update the AppModule by adding the following bit of configuration in the `imports` list, to enable store inspection:

   ``` typescript
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
   ```
3. Implement actions, reducers, effects, ... as needed
4. Define an Angular module to bootstrap the current feature store as follows:

   ```typescript
   @NgModule({
    imports: [
      StoreModule.forRoot({ [Features.EXPENSE]: expenseReducer }),
      EffectsModule.forRoot([ExpenseEffects]),
    ],
    providers: [ExpenseFacade],
   })
   export class ExpenseNgRxModule {
     constructor(@Optional() @SkipSelf() selfModule?: ExpenseNgRxModule) {
       if (selfModule) {
         throw new Error('ExpenseNgRxModule is already loaded. Import it once only!');
       }
     }

     static forRoot(basePath: string): ModuleWithProviders<ExpenseNgRxModule> {
       return {
         ngModule: ExpenseNgRxModule,
         providers: [{ provide: BASE_PATH, useValue: basePath }],
       };
     }
   }
   ```

5. Import this module from `AppModule`

### 10. Internationalisation

To handle i18n dynamically (user could change the language within the app at any time, without having to actually reload the app), we'll be using `npm install @`ngx-translate`.

For more details about setup, refer to [https://github.com/ngx-translate/core](https://github.com/ngx-translate/core)
