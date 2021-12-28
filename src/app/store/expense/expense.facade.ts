import { Injectable } from '@angular/core';
import { ExpenseQuery, State } from './expense.reducers';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';
import {
  selectCurrentExpensePage,
  selectPendingRequest, selectTotalNumberOfExpenses,
} from './expense.selectors';

@Injectable()
export class ExpenseFacade {
  currentExpensePage$ = this.store$.select(selectCurrentExpensePage);
  loadingExpense$ = this.store$.select(selectPendingRequest);
  totalNumberOfExpenses$ = this.store$.select(selectTotalNumberOfExpenses);

  constructor(private readonly store$: Store<State>) {}

  loadExpensePage(query: ExpenseQuery): void {
    this.store$.dispatch(
      ExpenseActions.fetchExpensePage({
        query,
      })
    );
  }
}
