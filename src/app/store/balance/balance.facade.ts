import { Injectable } from '@angular/core';
import { State } from './balance.reducers';
import { Store } from '@ngrx/store';
import { selectBalance, selectPendingRequest } from './balance.selectors';
import * as BalanceActions from './balance.actions';

@Injectable()
export class BalanceFacade {
  balance$ = this.store$.select(selectBalance);
  loadingBalance$ = this.store$.select(selectPendingRequest);

  constructor(private readonly store$: Store<State>) {}

  loadBalance(): void {
    this.store$.dispatch(BalanceActions.fetchBalance());
  }
}
