import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../stores';
import { State } from './balance.reducers';

const selectFeature = createFeatureSelector<State>(Features.BALANCE);

export const selectPendingRequest = createSelector(
  selectFeature,
  (state) => state.pendingRequest
);

export const selectBalance = createSelector(
  selectFeature,
  (state) => state.balance
);
