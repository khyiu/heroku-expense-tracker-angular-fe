import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../stores';
import { expenseResponseEntityAdapter, State } from './expense.reducers';

const selectFeature = createFeatureSelector<State>(Features.EXPENSE);

export const selectCurrentExpensePage = createSelector(
  selectFeature,
  expenseResponseEntityAdapter.getSelectors().selectAll
);

export const selectPendingReadRequest = createSelector(
  selectFeature,
  (state) => state.pendingReadRequest
);

export const selectTotalNumberOfExpenses = createSelector(
  selectFeature,
  (state) => state.totalNumberOfItems
);
