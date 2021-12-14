import { StoreModule } from '@ngrx/store';
import { expenseReducer } from './expense.reducers';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ExpenseEffects } from './expense.effects';
import { ExpenseFacade } from './expense.facade';
import { BASE_PATH } from '../../generated-sources/expense-api';
import { Features } from '../stores';

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
      throw new Error(
        'ExpenseNgRxModule is already loaded. Import it once only!'
      );
    }
  }

  static forRoot(basePath: string): ModuleWithProviders<ExpenseNgRxModule> {
    return {
      ngModule: ExpenseNgRxModule,
      providers: [{ provide: BASE_PATH, useValue: basePath }],
    };
  }
}
