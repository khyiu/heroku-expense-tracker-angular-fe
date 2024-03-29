import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BalanceService } from '../../generated-sources/expense-api';
import * as BalanceActions from './balance.actions';
import * as ExpenseActions from '../expense/expense.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class BalanceEffects {
  private readonly actions$ = inject(Actions);
  private readonly balanceService = inject(BalanceService);

  fetchBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BalanceActions.fetchBalance),
      mergeMap(() =>
        this.balanceService
          .getBalance()
          .pipe(map((balance) => BalanceActions.balanceFetched({ balance })))
      ),
      catchError(() => of(BalanceActions.BalanceError()))
    )
  );

  expenseCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.expenseCreated),
      map(() => BalanceActions.fetchBalance())
    )
  );

  expenseDeleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.expenseDeleted),
      map(() => BalanceActions.fetchBalance())
    )
  );

  expenseUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.expenseUpdated),
      map(() => BalanceActions.fetchBalance())
    )
  );
}
