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

export const selectPendingWriteRequest = createSelector(
  selectFeature,
  (state) => state.pendingWriteRequest
);

export const selectPendingImportRequest = createSelector(
  selectFeature,
  (state) => state.pendingImportRequest
);

export const selectTotalNumberOfExpenses = createSelector(
  selectFeature,
  (state) => state.totalNumberOfItems
);

export const selectCurrentExpensePaginationQuery = createSelector(
  selectFeature,
  (state) => state.paginationQuery
);

export const selectCurrentExpenseFilteringQuery = createSelector(
  selectFeature,
  (state) => state.filteringQuery
);

export const selectPendingExportRequest = createSelector(
  selectFeature,
  (state) => state.pendingExportRequest
);
