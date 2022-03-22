import { Injectable } from '@angular/core';
import { ExpenseQuery, State } from './expense.reducers';
import { Store } from '@ngrx/store';
import * as ExpenseActions from './expense.actions';
import {
  selectCurrentExpensePage,
  selectCurrentExpensePageQuery,
  selectPendingImportRequest,
  selectPendingReadRequest,
  selectTotalNumberOfExpenses,
} from './expense.selectors';
import { ExpenseRequest } from '../../generated-sources/expense-api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class ExpenseFacade {
  currentExpensePage$ = this.store$.select(selectCurrentExpensePage);
  pendingReadRequest$ = this.store$.select(selectPendingReadRequest);
  totalNumberOfExpenses$ = this.store$.select(selectTotalNumberOfExpenses);
  currentPageQuery$ = this.store$.select(selectCurrentExpensePageQuery);
  pendingImportRequest$ = this.store$.select(selectPendingImportRequest);

  constructor(private readonly store$: Store<State>) {}

  loadExpensePage(query: ExpenseQuery): void {
    this.store$.dispatch(
      ExpenseActions.fetchExpensePage({
        query,
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
}
