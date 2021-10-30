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

#Journey log

## 1. CI using CircleCI
At the root of the project, create a folder named `.circleci`.  
Inside this folder, create a `config.yml` file. This configuration specifies the steps that must be executed on CircleCI when
changes are pushed to the `main` branch.

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

4. The actual deployment to Heroku is done using the `circleci/heroku` orb. By importing this orb in our CircleCI config, we'll get 
access to the `heroku/deploy-via-git` job. We only need to specify the Heroku API key, the application name on Heroku server and the
branch to deploy.

## 3. Components library
The components I'll be using for this project is [PrimeNG](https://www.primefaces.org/primeng/showcase/#/).
Although this library might not have the best look and feel when compared to some other components libraries, I've chosen it because it 
is also available for VueJS. This will help to make a fair comparison between VueJS and Angular in a future project.

Installation:
```bash
npm install --save primeng
```

## 4. Layout and theming
1. Icons library from PrimeNG:  
   ```bash
   npm install --save primeicons 
   ```
2. Grid/Flexbox/... library:
   ```bash
   npm install --save primeflex
   ```
3. Import the theming, layout and icons scss resources by adding the following lines in `styles.scss`
