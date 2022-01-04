import { createReducer, on } from '@ngrx/store';

import * as BalanceActions from './balance.actions';

export interface State {
  pendingRequest: boolean;
  balance: number | null;
}

export const initialState: State = {
  pendingRequest: false,
  balance: null,
};

export const balanceReducer = createReducer(
  initialState,
  on(BalanceActions.fetchBalance, (state) => ({
    ...state,
    pendingRequest: true,
  })),
  on(BalanceActions.balanceFetched, (state, action) => ({
    pendingRequest: false,
    balance: action.balance,
  }))
);
