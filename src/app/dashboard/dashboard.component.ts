import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'het-dashboard',
  template: `
    <ng-container *ngIf="expenses$ | async as expenses">
      <p-table
        #dt
        [value]="expenses"
        [rows]="10"
        [paginator]="true"
        [globalFilterFields]="['date', 'amount']"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [showCurrentPageReport]="true"
      >
        <ng-template pTemplate="caption">
          <div class="p-d-flex p-ai-center p-jc-between">
            <h5 class="p-m-0">Manage expenses</h5>
            <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              placeholder="Search..."
            />
          </span>
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th pSortableColumn="date">
              Name
              <p-sortIcon field="date"></p-sortIcon>
            </th>
            <th pSortableColumn="amount">
              Price
              <p-sortIcon field="amount"></p-sortIcon>
            </th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-expense>
          <tr>
            <td>
              <p-tableCheckbox [value]="expense"></p-tableCheckbox>
            </td>
            <td>2021-01-01</td>
            <td>{{ '20' | currency: 'EUR' }}</td>
            <td>
              <button
                pButton
                pRipple
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success p-mr-2"
              ></button>
              <button
                pButton
                pRipple
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
              ></button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="summary">
          <div class="p-d-flex p-ai-center p-jc-between">
            In total there are 100 expenses.
          </div>
        </ng-template>
      </p-table>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  expenses$: Observable<any[]> = of([{date: new Date(), amount: 1.52}]);
}
