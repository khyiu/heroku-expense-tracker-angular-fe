import { Injectable } from '@angular/core';
import {
  ExpenseFilteringQuery,
  ExpensePaginationQuery,
  State,
} from './expense.reducers';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';
import {
  selectCurrentExpenseFilteringQuery,
  selectCurrentExpensePage,
  selectCurrentExpensePaginationQuery,
  selectPendingImportRequest,
  selectPendingReadRequest,
  selectPendingWriteRequest,
  selectTotalNumberOfExpenses,
} from './expense.selectors';
import { ExpenseRequest } from '../../generated-sources/expense-api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class ExpenseFacade {
  currentExpensePage$ = this.store$.select(selectCurrentExpensePage);
  pendingReadRequest$ = this.store$.select(selectPendingReadRequest);
  totalNumberOfExpenses$ = this.store$.select(selectTotalNumberOfExpenses);
  currentPaginationQuery = this.store$.select(
    selectCurrentExpensePaginationQuery
  );
  currentFilterQuery = this.store$.select(selectCurrentExpenseFilteringQuery);
  pendingImportRequest$ = this.store$.select(selectPendingImportRequest);
  pendingWriteRequest$ = this.store$.select(selectPendingWriteRequest);

  constructor(private readonly store$: Store<State>) {}

  loadExpensePage(
    paginationQuery: ExpensePaginationQuery,
    filteringQuery?: ExpenseFilteringQuery
  ): void {
    this.store$.dispatch(
      ExpenseActions.fetchExpensePage({
        paginationQuery,
        filteringQuery,
      })
    );
  }

  createExpense(
    expenseRequest: ExpenseRequest,
    dialogRef: DynamicDialogRef
  ): void {
    this.store$.dispatch(
      ExpenseActions.createExpense({
        expenseRequest,
        dialogRef,
      })
    );
  }

  deleteExpense(expenseId: string): void {
    this.store$.dispatch(ExpenseActions.deleteExpense({ expenseId }));
  }

  updateExpense(
    expenseId: string,
    expenseRequest: ExpenseRequest,
    dialogRef: DynamicDialogRef
  ): void {
    this.store$.dispatch(
      ExpenseActions.updateExpense({ expenseId, expenseRequest, dialogRef })
    );
  }

  importExpenses(file: File): void {
    this.store$.dispatch(ExpenseActions.importExpenses({ file }));
  }

  exportExpenses(): void {
    this.store$.dispatch(ExpenseActions.exportExpenses());
  }

  updateExpensesStatus(checked: boolean, expenseIds: string[]): void {
    this.store$.dispatch(
      ExpenseActions.updateExpensesStatus({ checked, expenseIds })
    );
  }
}
