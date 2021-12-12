import { StoreModule } from '@ngrx/store';
import { expenseReducer } from './expense.reducers';
import { NgModule } from '@angular/core';
import { EffectsModule, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { ExpenseEffects } from './expense.effects';
import { ExpenseFacade } from './expense.facade';

@NgModule({
  // imports: [StoreModule.forFeature('expense', { expenseReducer })],

  // imports: [
  //   StoreModule.forRoot(expenseReducer),
  //   EffectsModule.forRoot([ExpenseEffects]),
  // ],

  // providers: [
  //   ExpenseEffects,
  //   {
  //     provide: USER_PROVIDED_EFFECTS,
  //     multi: true,
  //     useValue: [ExpenseEffects],
  //   },
  // ]

  providers: [ExpenseFacade],
})
export class ExpenseNgRxModule {}
