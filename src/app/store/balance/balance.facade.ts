import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBalance, selectPendingRequest } from './balance.selectors';
import * as BalanceActions from './balance.actions';

@Injectable()
export class BalanceFacade {
  private readonly store$ = inject(Store);

  balance$ = this.store$.select(selectBalance);
  loadingBalance$ = this.store$.select(selectPendingRequest);

  loadBalance(): void {
    this.store$.dispatch(BalanceActions.fetchBalance());
  }
}
