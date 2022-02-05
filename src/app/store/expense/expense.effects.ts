import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExpensesService } from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

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
            catchError(() => of(ExpenseActions.ExpenseError()))
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
          catchError(() => of(ExpenseActions.ExpenseError()))
        )
      )
    )
  );

  expenseCreated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExpenseActions.expenseCreated),
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: 'Data saved',
            detail: 'The expense has been created',
          })
        ),
        tap((action) => action.dialogRef.close())
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly expensesService: ExpensesService,
    private readonly messageService: MessageService
  ) {}
}
