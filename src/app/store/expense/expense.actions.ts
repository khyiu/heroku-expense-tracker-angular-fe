import { createAction, props } from '@ngrx/store';
import { ExpenseQuery } from './expense.reducers';
import {
  ExpenseRequest,
  ExpenseResponse,
} from '../../generated-sources/expense-api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

export const fetchExpensePage = createAction(
  '[Expense] Fetch page',
  props<{
    query: ExpenseQuery;
  }>()
);

export const expensePageFetched = createAction(
  '[Expense] Page fetched',
  props<{
    totalNumberOfItems: number;
    items: ExpenseResponse[];
  }>()
);

export const ExpenseError = createAction('[Expense] Error');

export const createExpense = createAction(
  '[Expense] Create',
  props<{
    expenseRequest: ExpenseRequest;
    dialogRef: DynamicDialogRef;
  }>()
);

export const expenseCreated = createAction(
  '[Expense] Created',
  props<{
    expenseResponse: ExpenseResponse;
    dialogRef: DynamicDialogRef;
  }>()
);
