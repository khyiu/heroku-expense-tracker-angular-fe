import { Injectable } from '@angular/core';
import { State } from './expense.reducers';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';

@Injectable()
export class ExpenseFacade {
  constructor(private store$: Store<State>) {}

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
