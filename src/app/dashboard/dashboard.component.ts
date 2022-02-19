import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ExpenseResponse,
  ExpensesService,
} from '../generated-sources/expense-api';
import { ExpenseFacade } from '../store/expense/expense.facade';
import { DATE_FORMAT } from '../shared/shared.constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  ExpenseQuery,
  SortAttribute,
  SortDirection,
} from '../store/expense/expense.reducers';
import { DASHBOARD_PARAMS } from '../routing.constants';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { BalanceFacade } from '../store/balance/balance.facade';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseModalFormComponent } from './expense-modal-form.component';

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
      <het-dashboard-toolbar></het-dashboard-toolbar>
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
        (onLazyLoad)="loadExpensePage($event)"
        [(first)]="currentPageFirstItemIdx"
        [(rows)]="pageSize"
        [totalRecords]="(totalNumberOfExpenses$ | async) || 0"
        currentPageReportTemplate="{{ 'PaginatorSummary' | translate }}"
        styleClass="p-datatable-striped"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>{{ 'Date' | translate }}</th>
            <th>{{ 'Amount' | translate }}</th>
            <th>{{ 'Description' | translate }}</th>
            <th>{{ 'Tags' | translate }}</th>
            <th>{{ 'Actions' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-expense>
          <tr>
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
                  [value]="tag"
                  severity="info"
                ></p-tag>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly dateFormat = DATE_FORMAT;
  readonly paginatorPageSizes = [10, 15, 25];
  readonly defaultExpenseQuery: ExpenseQuery = {
    pageSize: this.paginatorPageSizes[0],
    pageNumber: 1,
    sortDirection: 'DESC',
    sortBy: 'DATE',
  } as const;

  totalNumberOfExpenses$: Observable<number | null> =
    this.expenseFacade.totalNumberOfExpenses$;
  expenses$: Observable<ExpenseResponse[]> =
    this.expenseFacade.currentExpensePage$;
  loading$: Observable<boolean> = this.expenseFacade.pendingReadRequest$;

  balance$: Observable<number | null> = this.balanceFacade.balance$;

  currentPageFirstItemIdx = 0;
  pageSize = this.paginatorPageSizes[0];

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

  ngOnInit(): void {
    const expenseQuery = this.extractExpenseQueryFromRoute();
    this.initPaginatorInfo(expenseQuery);

    this.balanceFacade.loadBalance();
  }

  loadExpensePage(event: LazyLoadEvent): void {
    const expenseQuery =
      DashboardComponent.convertLazyLoadEventToExpenseQuery(event);
    this.expenseFacade.loadExpensePage(expenseQuery);

    this.router.navigate(['.'], {
      queryParams: {
        pageNumber: event.first! / event.rows! + 1,
        pageSize: event.rows,
        sortDirection: event.sortField! === '0' ? 'ASC' : 'DESC',
        sortBy: 'DATE',
      } as ExpenseQuery,
    });
  }

  private initPaginatorInfo(expenseQuery: ExpenseQuery): void {
    this.pageSize = expenseQuery.pageSize;
    this.currentPageFirstItemIdx =
      (expenseQuery.pageNumber - 1) * expenseQuery.pageSize;
  }

  private extractExpenseQueryFromRoute(): ExpenseQuery {
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    return {
      pageSize: DashboardComponent.extractPageSizeParamFromRoute(
        queryParamMap,
        this.defaultExpenseQuery.pageSize
      ),
      pageNumber: DashboardComponent.extractPageNumberParamFromRoute(
        queryParamMap,
        this.defaultExpenseQuery.pageNumber
      ),

      sortDirection: DashboardComponent.extractSortDirectionParamFromRoute(
        queryParamMap,
        this.defaultExpenseQuery.sortDirection
      ),

      sortBy: DashboardComponent.extractSortAttributeParamFromRoute(
        queryParamMap,
        this.defaultExpenseQuery.sortBy
      ),
    };
  }

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

  private static convertLazyLoadEventToExpenseQuery(
    event: LazyLoadEvent
  ): ExpenseQuery {
    return {
      pageSize: event.rows!,
      pageNumber: event.first! / event.rows! + 1,
      sortBy: 'DATE',
      sortDirection: 'DESC',
    };
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
}
