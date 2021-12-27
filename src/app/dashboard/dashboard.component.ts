import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ExpenseResponse,
  ExpensesService,
} from '../generated-sources/expense-api';
import { ExpenseFacade } from '../store/expense/expense.facade';
import { DATE_FORMAT } from '../shared/shared.constants';

@Component({
  selector: 'het-dashboard',
  template: `
    <p-panel [showHeader]="false">
      <p-table
        [value]="(expenses$ | async) || []"
        [rowHover]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="paginatorPageSizes"
        [loading]="(loading$ | async) || false"
        [paginator]="true"
        (rowsChange)="changePageSize($event)"
        currentPageReportTemplate="{{ 'PaginatorSummary' | translate }}"
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
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `,
  styles: [
    `
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
export class DashboardComponent {
  readonly dateFormat = DATE_FORMAT;
  readonly paginatorPageSizes = [10, 15, 25];

  expenses$: Observable<ExpenseResponse[]> =
    this.expenseFacade.currentExpensePage$;

  loading$: Observable<boolean> = this.expenseFacade.loadingExpense$;

  constructor(
    private readonly expensesApiService: ExpensesService,
    private readonly expenseFacade: ExpenseFacade
  ) {
    this.expenseFacade.loadExpensePage();
  }

  changePageSize(pageSize: number): void {
    // todo kyiu: handle pageSize selection
    console.log(pageSize);
  }
}
