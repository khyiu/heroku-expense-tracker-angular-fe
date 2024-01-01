import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ExpenseService,
  ExpensesService,
} from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';
import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { ExpenseFacade } from './expense.facade';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ExpenseEffects {
  private readonly actions$ = inject(Actions);
  private readonly expensesService = inject(ExpensesService);
  private readonly expenseService = inject(ExpenseService);
  private readonly messageService = inject(MessageService);
  private readonly expenseFacade = inject(ExpenseFacade);
  private readonly translateService = inject(TranslateService);

  fetchExpensePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.fetchExpensePage),
      mergeMap((action: ReturnType<typeof ExpenseActions.fetchExpensePage>) =>
        this.expensesService
          .getExpenses(
            action.paginationQuery.pageSize,
            action.paginationQuery.pageNumber,
            action.paginationQuery.sortDirection,
            action.paginationQuery.sortBy,
            action.filteringQuery?.tagFilters,
            action.filteringQuery?.descriptionFilters,
            action.filteringQuery?.paidWithCreditCardFilter,
            action.filteringQuery?.creditCardStatementIssuedFilter,
            action.filteringQuery?.inclusiveDateLowerBound,
            action.filteringQuery?.inclusiveDateUpperBound,
            action.filteringQuery?.checked,
            action.filteringQuery?.inclusiveAmountLowerBound,
            action.filteringQuery?.inclusiveAmountUpperBound
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
          summary: this.translateService.instant('DataSaved'),
          detail: this.translateService.instant('ExpenseCreated'),
        })
      ),
      tap((action) => action.dialogRef.close()),
      map(() => ExpenseActions.refreshCurrentPage())
    )
  );

  refreshExpensePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.refreshCurrentPage),
      withLatestFrom(
        this.expenseFacade.currentPaginationQuery$,
        this.expenseFacade.currentFilterQuery$
      ),
      mergeMap(([, currentPageQuery, currentFilterQuery]) =>
        this.expensesService
          .getExpenses(
            currentPageQuery.pageSize,
            currentPageQuery.pageNumber,
            currentPageQuery.sortDirection,
            currentPageQuery.sortBy,
            currentFilterQuery?.tagFilters,
            currentFilterQuery?.descriptionFilters,
            currentFilterQuery?.paidWithCreditCardFilter,
            currentFilterQuery?.creditCardStatementIssuedFilter,
            currentFilterQuery?.inclusiveDateLowerBound,
            currentFilterQuery?.inclusiveDateUpperBound,
            currentFilterQuery?.checked
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
          summary: this.translateService.instant('DataDeleted'),
          detail: this.translateService.instant('ExpenseDeleted'),
        })
      ),
      map(() => ExpenseActions.refreshCurrentPage())
    )
  );

  updateExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.updateExpense),
      mergeMap((action: ReturnType<typeof ExpenseActions.updateExpense>) =>
        this.expenseService
          .updateExpense(action.expenseId, action.expenseRequest)
          .pipe(
            map((response) =>
              ExpenseActions.expenseUpdated({
                expenseResponse: response,
                dialogRef: action.dialogRef,
              })
            )
          )
      )
    )
  );

  expenseUpdated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExpenseActions.expenseUpdated),
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('DataSaved'),
            detail: this.translateService.instant('ExpenseUpdated'),
          })
        ),
        tap((action) => action.dialogRef.close())
      ),
    { dispatch: false }
  );

  importExpenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.importExpenses),
      switchMap((action: ReturnType<typeof ExpenseActions.importExpenses>) =>
        this.expensesService
          .importExpenses(action.file)
          .pipe(map(() => ExpenseActions.expensesImported()))
      )
    )
  );

  expensesImported$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExpenseActions.expensesImported),
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('DataImported'),
            detail: this.translateService.instant('ExpensesImported'),
          })
        )
      ),
    { dispatch: false }
  );

  exportExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.exportExpenses),
      mergeMap(() =>
        this.expensesService.exportExpenses('response').pipe(
          tap((response) => {
            const contentDispositionValue = response.headers.get(
              'content-disposition'
            );
            const attachmentFilenameRegexp =
              /^attachment; filename="(?<default_filename>.*)"$/;

            const a = document.createElement('a');
            const url = window.URL.createObjectURL(response.body);
            a.href = url;
            a.download = contentDispositionValue.match(
              attachmentFilenameRegexp
            ).groups['default_filename'];
            a.click();
            window.URL.revokeObjectURL(url);
          }),
          map(() => ExpenseActions.expensesExported())
        )
      )
    )
  );

  updateExpensesStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.updateExpensesStatus),
      mergeMap(
        (action: ReturnType<typeof ExpenseActions.updateExpensesStatus>) =>
          this.expensesService
            .updateExpensesCheckedStatus({
              checked: action.checked,
              expenseIds: action.expenseIds,
            })
            .pipe(
              map((expenseResponses) =>
                ExpenseActions.expensesStatusUpdated({
                  expenses: expenseResponses,
                })
              ),
              catchError(() => of(ExpenseActions.expenseError()))
            )
      )
    )
  );
}
