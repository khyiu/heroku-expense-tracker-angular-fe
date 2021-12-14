import { createAction, props } from '@ngrx/store';
import { ExpenseQuery } from './expense.reducers';
import { ExpenseResponse } from '../../generated-sources/expense-api';

export const fetchExpensePage = createAction(
  '[Expense] Fetch page',
  props<{
    query: ExpenseQuery;
  }>()
);

export const ExpensePageFetched = createAction(
  '[Expense] Page fetched',
  props<{
    totalNumberOfItems: number;
    items: ExpenseResponse[];
  }>()
);

export const ExpenseError = createAction('[Expense] Error');
