import { createAction, props } from '@ngrx/store';

export const fetchBalance = createAction('[Balance] Fetch balance');

export const balanceFetched = createAction(
  '[Balance] Balance fetched',
  props<{ balance: number }>()
);

export const BalanceError = createAction('[Balance] Error');
