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

export const expenseError = createAction('[Expense] Error');

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

export const refreshCurrentPage = createAction('[Expense] Refresh page');

export const currentPageRefreshed = createAction(
  '[Expense] Page refreshed',
  props<{
    totalNumberOfItems: number;
    items: ExpenseResponse[];
  }>()
);

export const deleteExpense = createAction(
  '[Expense] Delete',
  props<{
    expenseId: string;
  }>()
);

export const expenseDeleted = createAction('[Expense] Deleted');

export const updateExpense = createAction(
  '[Expense] Update',
  props<{
    expenseId: string;
    expenseRequest: ExpenseRequest;
    dialogRef: DynamicDialogRef;
  }>()
);

export const expenseUpdated = createAction(
  '[Expense] Updated',
  props<{
    expenseResponse: ExpenseResponse;
    dialogRef: DynamicDialogRef;
  }>()
);

export const importExpenses = createAction(
  '[Expense] Import file',
  props<{ file: File }>()
);

export const expensesImported = createAction('[Expense] File imported');

export const exportExpenses = createAction('[Expense] Export');

export const updateExpensesStatus = createAction(
  '[Expense] Update status',
  props<{
    checked: boolean;
    expenseIds: string[];
  }>()
);

export const expensesStatusUpdated = createAction(
  '[Expense] Status updated',
  props<{
    expenses: ExpenseResponse[];
  }>()
);
