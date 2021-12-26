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
    <ng-container *ngIf="expenses$ | async as expenses">
      <p-table [value]="expenses">
        <ng-template pTemplate="header">
          <tr>
            <th>{{ 'Date' | translate }}</th>
            <th>{{ 'Amount' | translate }}</th>
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
          </tr>
        </ng-template>
      </p-table>
    </ng-container>
  `,
  styles: [
    `
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
      }

      .layout-news-active :host ::ng-deep .p-datatable tr > th {
        top: 0;
      }

      @media screen and (max-width: 64em) {
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
          top: 0;
        }

        .layout-news-active :host ::ng-deep .p-datatable tr > th {
          top: 0;
        }
      }
    `,

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

  expenses$: Observable<ExpenseResponse[]> =
    this.expenseFacade.currentExpensePage$;

  constructor(
    private readonly expensesApiService: ExpensesService,
    private readonly expenseFacade: ExpenseFacade
  ) {
    this.expenseFacade.loadExpensePage();
  }
}
