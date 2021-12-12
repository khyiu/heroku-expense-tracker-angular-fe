import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExpensesService } from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ExpenseEffects {
  fetchExpensePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.fetchExpensePage),
      mergeMap((action: ReturnType<typeof ExpenseActions.fetchExpensePage>) =>
        this.expensesService
          .getExpenses(
            action.query.pageSize,
            action.query.pageNumber,
            action.query.sortDirection,
            action.query.sortBy,
            action.query.tagFilters,
            action.query.descriptionFilter,
            action.query.paidWithCreditCardFilter,
            action.query.creditCardStatementIssuedFilter
          )
          .pipe(
            map((response) =>
              ExpenseActions.ExpensePageFetched({
                totalNumberOfItems: response.totalNumberOfItems,
                items: response.items,
              })
            ),
            catchError(() => of(ExpenseActions.ExpenseError()))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private expensesService: ExpensesService
  ) {}
}
