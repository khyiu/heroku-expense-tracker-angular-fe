import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BalanceService } from '../../generated-sources/expense-api';
import * as BalanceActions from './balance.actions';
import {catchError, map, mergeMap, of} from 'rxjs';

@Injectable()
export class BalanceEffects {
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

  constructor(
    private actions$: Actions,
    private balanceService: BalanceService
  ) {}
}
