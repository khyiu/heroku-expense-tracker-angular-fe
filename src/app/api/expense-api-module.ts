import { NgModule } from '@angular/core';
import { ApiModule, Configuration } from '../generated-sources/expense-api';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    ApiModule.forRoot(
      () =>
        new Configuration({
          basePath: environment.apiBasePath,
        })
    ),
  ],
})
export class ExpenseApiModule {}
