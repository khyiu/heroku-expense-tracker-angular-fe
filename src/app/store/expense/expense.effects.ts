import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ExpenseService,
  ExpensesService,
} from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ExpenseFacade } from './expense.facade';

@Injectable()
export class ExpenseEffects {
  fetchExpensePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.fetchExpensePage),
      mergeMap((action: ReturnType<typeof ExpenseActions.fetchExpensePage>) =>
        this.expensesService
          .getExpenses(
            action.query.pageSize,
            action.query.pageNumber,
            action.query.sortDirection,
            action.query.sortBy,
            action.query.tagFilters,
            action.query.descriptionFilter,
            action.query.paidWithCreditCardFilter,
            action.query.creditCardStatementIssuedFilter
          )
          .pipe(
            map((response) =>
              ExpenseActions.expensePageFetched({
                totalNumberOfItems: response.totalNumberOfItems,
                items: response.items,
              })
            ),
            catchError(() => of(ExpenseActions.expenseError()))
          )
      )
    )
  );

  createExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.createExpense),
      mergeMap((action: ReturnType<typeof ExpenseActions.createExpense>) =>
        this.expensesService.registerExpense(action.expenseRequest).pipe(
          map((response) =>
            ExpenseActions.expenseCreated({
              expenseResponse: response,
              dialogRef: action.dialogRef,
            })
          ),
          catchError(() => of(ExpenseActions.expenseError()))
        )
      )
    )
  );

  expenseCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.expenseCreated),
      tap(() =>
        this.messageService.add({
          severity: 'success',
          summary: 'Data saved',
          detail: 'The expense has been created',
        })
      ),
      tap((action) => action.dialogRef.close()),
      map(() => ExpenseActions.refreshCurrentPage())
    )
  );

  refreshExpensePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.refreshCurrentPage),
      withLatestFrom(this.expenseFacade.currentPageQuery$),
      mergeMap(([_action, currentPageQuery]) =>
        this.expensesService
          .getExpenses(
            currentPageQuery.pageSize,
            currentPageQuery.pageNumber,
            currentPageQuery.sortDirection,
            currentPageQuery.sortBy,
            currentPageQuery.tagFilters,
            currentPageQuery.descriptionFilter,
            currentPageQuery.paidWithCreditCardFilter,
            currentPageQuery.creditCardStatementIssuedFilter
          )
          .pipe(
            map((response) =>
              ExpenseActions.expensePageFetched({
                totalNumberOfItems: response.totalNumberOfItems,
                items: response.items,
              })
            ),
            catchError(() => of(ExpenseActions.expenseError()))
          )
      )
    )
  );

  deleteExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.deleteExpense),
      mergeMap((action: ReturnType<typeof ExpenseActions.deleteExpense>) =>
        this.expenseService.deleteExpense(action.expenseId).pipe(
          map(() => ExpenseActions.expenseDeleted()),
          catchError(() => of(ExpenseActions.expenseError()))
        )
      )
    )
  );

  expenseDeleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.expenseDeleted),
      tap(() =>
        this.messageService.add({
          severity: 'success',
          summary: 'Data deleted',
          detail: 'The expense has been deleted',
        })
      ),
      map(() => ExpenseActions.refreshCurrentPage())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly expensesService: ExpensesService,
    private readonly expenseService: ExpenseService,
    private readonly messageService: MessageService,
    private readonly expenseFacade: ExpenseFacade
  ) {}
}
