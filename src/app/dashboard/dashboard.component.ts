import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  ExpenseResponse,
  ExpensesService,
} from '../generated-sources/expense-api';
import { ExpenseFacade } from '../store/expense/expense.facade';
import { DATE_FORMAT } from '../shared/shared.constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  ExpenseFilteringQuery,
  ExpensePaginationQuery,
  SortAttribute,
  SortDirection,
} from '../store/expense/expense.reducers';
import { DASHBOARD_PARAMS } from '../routing.constants';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { BalanceFacade } from '../store/balance/balance.facade';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseModalFormComponent } from './expense-modal-form.component';
import { Filters } from './dashboard.model';

@Component({
  selector: 'het-dashboard',
  template: `
    <p-confirmDialog
      #cd
      header="{{ 'Confirmation' | translate }}"
      message="{{ 'ConfirmDeletion' | translate }}"
    >
      <ng-template pTemplate="footer">
        <button
          type="button"
          pButton
          icon="pi pi-times"
          class="p-button-outlined"
          label="{{ 'No' | translate }}"
          (click)="cd.reject()"
        ></button>
        <button
          type="button"
          pButton
          icon="pi pi-check"
          label="{{ 'Yes' | translate }}"
          (click)="cd.accept()"
        ></button>
      </ng-template>
    </p-confirmDialog>

    <div id="container" fxFlex="100">
      <h2>{{ 'Balance' | translate }} : {{ balance$ | async | euroAmount }}</h2>
      <div
        fxLayout="column"
        fxLayoutGap="0.5rem"
        *ngrxLet="currentPaginationQuery$; let currentPaginationQuery"
      >
        <het-dashboard-toolbar
          [selectedExpenseIds]="selectedExpenseIds$ | async"
        ></het-dashboard-toolbar>
        <het-filter
          [currentFilter]="currentFilterQuery$ | async"
          (filtersSelected)="applyFilters($event, currentPaginationQuery)"
        ></het-filter>
      </div>
      <ng-container *ngrxLet="currentFilterQuery$; let currentFilterQuery">
        <p-table
          [responsive]="true"
          [responsiveLayout]="'stack'"
          [lazy]="true"
          [value]="(expenses$ | async) || []"
          [rowHover]="true"
          [paginator]="true"
          [loading]="(loading$ | async) || false"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="paginatorPageSizes"
          (onLazyLoad)="loadExpensePage($event, currentFilterQuery)"
          [(first)]="currentPageFirstItemIdx"
          [(rows)]="pageSize"
          [totalRecords]="(totalNumberOfExpenses$ | async) || 0"
          [(selection)]="selectedExpenses"
          [selectionPageOnly]="true"
          (selectionChange)="updateSelection()"
          currentPageReportTemplate="{{ 'PaginatorSummary' | translate }}"
          styleClass="p-datatable-striped"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 3rem">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th id="colDate" style="width: 10%">{{ 'Date' | translate }}</th>
              <th id="colAmount" style="width: 12%">
                {{ 'Amount' | translate }}
              </th>
              <th id="colDescription" style="width: 40%">
                {{ 'Description' | translate }}
              </th>
              <th id="colTags" style="width: 20%">{{ 'Tags' | translate }}</th>
              <th id="colStatus" style="width: 9%">
                {{ 'Status' | translate }}
              </th>
              <th id="colActionsStatus" style="width: 9%">
                {{ 'Actions' | translate }}
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-expense>
            <tr>
              <td>
                <p-tableCheckbox [value]="expense"></p-tableCheckbox>
              </td>
              <td>
                {{ expense.date | date: dateFormat }}
              </td>
              <td
                [ngClass]="{
                  income: expense.amount > 0,
                  outcome: expense.amount < 0
                }"
              >
                {{ expense.amount | euroAmount }}
              </td>
              <td>
                {{ expense.description }}
              </td>
              <td>
                <div fxLayout="row" fxLayoutGap="1em">
                  <p-tag
                    *ngFor="let tag of expense.tags"
                    [value]="tag.value"
                    severity="info"
                  ></p-tag>
                </div>
              </td>
              <td>
                <div fxLayout="row" fxLayoutGap="1em">
                  <i
                    class="pi pi-check-circle"
                    [ngClass]="{
                      ready: !expense.checked,
                      done: expense.checked
                    }"
                  ></i>
                  <i
                    class="pi pi-credit-card ready"
                    *ngIf="
                      expense.paidWithCreditCard &&
                      !expense.creditCardStatementIssued
                    "
                  ></i>
                  <i
                    class="pi pi-credit-card done"
                    *ngIf="
                      expense.paidWithCreditCard &&
                      expense.creditCardStatementIssued
                    "
                  ></i>
                </div>
              </td>
              <td>
                <button
                  pButton
                  pRipple
                  type="button"
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger p-button-text"
                  (click)="triggerExpenseDeletion(expense.id)"
                ></button>
                <button
                  pButton
                  pRipple
                  type="button"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-info p-button-text"
                  (click)="editExpense(expense)"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </ng-container>
    </div>
  `,
  styles: [
    `
      #container {
        padding-left: 2rem;
        padding-right: 2rem;
      }

      .income {
        color: #32cd32;
      }

      .outcome {
        color: #dc143c;
      }

      #colDate,
      #colActionStatus {
        width: 10%;
      }

      #colStatus {
        width: 5%;
      }

      #colAmount {
        width: 12%;
      }

      .pi.ready {
        color: var(--yellow-400);
      }

      .pi.done {
        color: var(--green-400);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly dateFormat = DATE_FORMAT;
  readonly paginatorPageSizes = [10, 15, 25, 100];
  readonly defaultExpensePaginationQuery: ExpensePaginationQuery = {
    pageSize: this.paginatorPageSizes[0],
    pageNumber: 1,
    sortDirection: 'DESC',
    sortBy: 'DATE',
  } as const;

  totalNumberOfExpenses$: Observable<number | null> =
    this.expenseFacade.totalNumberOfExpenses$;
  expenses$: Observable<ExpenseResponse[]> =
    this.expenseFacade.currentExpensePage$.pipe(
      tap(() => this.clearSelection())
    );
  loading$: Observable<boolean> = this.expenseFacade.pendingReadRequest$;

  balance$: Observable<number | null> = this.balanceFacade.balance$;

  currentPageFirstItemIdx = 0;
  pageSize = this.paginatorPageSizes[0];
  selectedExpenses: ExpenseResponse[] = [];
  selectedExpenseIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  currentFilterQuery$ = this.expenseFacade.currentFilterQuery$;
  currentPaginationQuery$ = this.expenseFacade.currentPaginationQuery$;

  private ref: DynamicDialogRef;

  constructor(
    private readonly expensesApiService: ExpensesService,
    private readonly expenseFacade: ExpenseFacade,
    private readonly balanceFacade: BalanceFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly translateService: TranslateService,
    private readonly dialogService: DialogService
  ) {}

  private static extractPageSizeParamFromRoute(
    paramMap: ParamMap,
    defaultPageSize: number
  ): number {
    const pageSize = paramMap.get(DASHBOARD_PARAMS.PAGE_SIZE);
    return pageSize && parseInt(pageSize, 10) ? +pageSize : defaultPageSize;
  }

  private static extractPageNumberParamFromRoute(
    paramMap: ParamMap,
    defaultPageNumber: number
  ): number {
    const pageNumber = paramMap.get(DASHBOARD_PARAMS.PAGE_NUMBER);
    return pageNumber && parseInt(pageNumber, 10)
      ? +pageNumber
      : defaultPageNumber;
  }

  private static extractSortDirectionParamFromRoute(
    paramMap: ParamMap,
    defaultSortDirection: SortDirection
  ): SortDirection {
    const sortDirection = paramMap.get(DASHBOARD_PARAMS.SORT_DIRECTION);
    return sortDirection === 'ASC' || sortDirection === 'DESC'
      ? sortDirection
      : defaultSortDirection;
  }

  private static extractSortAttributeParamFromRoute(
    paramMap: ParamMap,
    defaultSortAttribute: SortAttribute
  ): SortAttribute {
    const sortAttribute = paramMap.get(DASHBOARD_PARAMS.SORT_BY);
    return sortAttribute === 'DATE' || sortAttribute === 'AMOUNT'
      ? sortAttribute
      : defaultSortAttribute;
  }

  private static convertLazyLoadEventToExpensePaginationQuery(
    event: LazyLoadEvent
  ): ExpensePaginationQuery {
    return {
      pageSize: event.rows!,
      pageNumber: event.first! / event.rows! + 1,
      sortBy: 'DATE',
      sortDirection: 'DESC',
    };
  }

  ngOnInit(): void {
    const expenseQuery = this.extractExpensePaginationQueryFromRoute();
    const filteringQuery = this.extractExpenseFilteringQueryFromRoute();
    this.initPaginatorInfo(expenseQuery);

    this.expenseFacade.loadExpensePage(expenseQuery, filteringQuery);
    this.balanceFacade.loadBalance();
  }

  loadExpensePage(
    event: LazyLoadEvent,
    currentFilteringQuery?: ExpenseFilteringQuery
  ): void {
    const expenseQuery =
      DashboardComponent.convertLazyLoadEventToExpensePaginationQuery(event);
    this.expenseFacade.loadExpensePage(expenseQuery, currentFilteringQuery);

    this.router.navigate(['.'], {
      queryParams: {
        pageNumber: event.first! / event.rows! + 1,
        pageSize: event.rows,
        sortDirection: event.sortField! === '0' ? 'ASC' : 'DESC',
        sortBy: 'DATE',
        ...currentFilteringQuery,
      } as ExpensePaginationQuery,
    });
  }

  triggerExpenseDeletion(expenseId: string): void {
    this.confirmationService.confirm({
      accept: () => this.expenseFacade.deleteExpense(expenseId),
    });
  }

  editExpense(expense: ExpenseResponse): void {
    this.ref = this.dialogService.open(ExpenseModalFormComponent, {
      header: this.translateService.instant('EditExpense'),
      width: '40%',
      data: expense,
    });
  }

  private initPaginatorInfo(expenseQuery: ExpensePaginationQuery): void {
    this.pageSize = expenseQuery.pageSize;
    this.currentPageFirstItemIdx =
      (expenseQuery.pageNumber - 1) * expenseQuery.pageSize;
  }

  private extractExpensePaginationQueryFromRoute(): ExpensePaginationQuery {
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    return {
      pageSize: DashboardComponent.extractPageSizeParamFromRoute(
        queryParamMap,
        this.defaultExpensePaginationQuery.pageSize
      ),
      pageNumber: DashboardComponent.extractPageNumberParamFromRoute(
        queryParamMap,
        this.defaultExpensePaginationQuery.pageNumber
      ),

      sortDirection: DashboardComponent.extractSortDirectionParamFromRoute(
        queryParamMap,
        this.defaultExpensePaginationQuery.sortDirection
      ),

      sortBy: DashboardComponent.extractSortAttributeParamFromRoute(
        queryParamMap,
        this.defaultExpensePaginationQuery.sortBy
      ),
    };
  }

  private extractExpenseFilteringQueryFromRoute(): ExpenseFilteringQuery | null {
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    return {
      tagFilters: queryParamMap.getAll('tagFilters'),
      descriptionFilters: queryParamMap.getAll('descriptionFilters'),
      paidWithCreditCardFilter: JSON.parse(
        queryParamMap.get('paidWithCreditCardFilter')
      ),
      creditCardStatementIssuedFilter: JSON.parse(
        queryParamMap.get('creditCardStatementIssuedFilter')
      ),
      checked: JSON.parse(queryParamMap.get('checked')),
      inclusiveDateLowerBound: queryParamMap.get('inclusiveDateLowerBound'),
      inclusiveDateUpperBound: queryParamMap.get('inclusiveDateUpperBound'),
      inclusiveAmountLowerBound: JSON.parse(
        queryParamMap.get('inclusiveAmountLowerBound')
      ),
      inclusiveAmountUpperBound: JSON.parse(
        queryParamMap.get('inclusiveAmountUpperBound')
      ),
    };
  }

  updateSelection(): void {
    this.selectedExpenseIds$.next(
      this.selectedExpenses.map((expense) => expense.id)
    );
  }

  clearSelection(): void {
    this.selectedExpenses = [];
    this.updateSelection();
  }

  applyFilters(
    filters: Filters,
    currentPaginationQuery: ExpensePaginationQuery
  ): void {
    let filterQuery = this.convertToFilterQuery(filters);
    const paginationQueryResetToFirstPage = {
      ...currentPaginationQuery,
      pageNumber: 1,
    };
    this.initPaginatorInfo(paginationQueryResetToFirstPage);

    this.expenseFacade.loadExpensePage(
      paginationQueryResetToFirstPage,
      filterQuery
    );
    this.router.navigate(['.'], {
      queryParams: {
        ...paginationQueryResetToFirstPage,
        ...filterQuery,
      } as ExpensePaginationQuery,
    });
  }

  private convertToFilterQuery(
    filters?: Filters
  ): ExpenseFilteringQuery | null {
    return filters
      ? {
          descriptionFilters: filters?.descriptions,
          tagFilters: filters?.tags?.map((tag) => tag.id),
          paidWithCreditCardFilter: filters?.paidWithCreditCard,
          creditCardStatementIssuedFilter: filters?.creditCardStatementIssued,
          checked: filters?.checked,
          inclusiveAmountLowerBound: filters?.amountLowerBound,
          inclusiveAmountUpperBound: filters?.amountUpperBound,
          inclusiveDateLowerBound: filters?.dateLowerBound
            ?.toISOString()
            .substr(0, 10),
          inclusiveDateUpperBound: filters?.dateUpperBound
            ?.toISOString()
            .substr(0, 10),
        }
      : null;
  }
}
