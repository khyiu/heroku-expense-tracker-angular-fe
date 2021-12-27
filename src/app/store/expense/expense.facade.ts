import { Injectable } from '@angular/core';
import { State } from './expense.reducers';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';
import {
  selectCurrentExpensePage,
  selectPendingRequest,
} from './expense.selectors';

@Injectable()
export class ExpenseFacade {
  currentExpensePage$ = this.store$.select(selectCurrentExpensePage);
  loadingExpense$ = this.store$.select(selectPendingRequest);

  constructor(private readonly store$: Store<State>) {}

  // todo kyiu: replace hardcoded params
  loadExpensePage(): void {
    this.store$.dispatch(
      ExpenseActions.fetchExpensePage({
        query: {
          pageSize: 5,
          pageNumber: 1,
          sortBy: 'DATE',
          sortDirection: 'DESC',
        },
      })
    );
  }
}
