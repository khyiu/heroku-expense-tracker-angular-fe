import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CALENDAR_DATE_FORMAT } from '../shared/shared.constants';
import { FormControl, FormGroup } from '@angular/forms';
import { Filters } from './dashboard.model';

@Component({
  selector: 'het-filter',
  template: `
    <p-accordion>
      <p-accordionTab header="{{ 'Filters' | translate }}">
        <form [formGroup]="filterGroup" fxLayout="column" fxLayoutGap="0.5rem">
          <div fxLayout="row" fxLayoutGap="1rem" fxLayoutAlign=" center">
            <label>{{ 'OperationDateBetween' | translate }}</label>
            <p-calendar
              [formControl]="dateLowerBoundControl"
              [dateFormat]="dateFormat"
              [showIcon]="true"
              [firstDayOfWeek]="1"
              appendTo="body"
            ></p-calendar>
            <label for="dateLowerBound">{{
              'And' | translate | lowercase
            }}</label>
            <p-calendar
              [formControl]="dateUpperBoundControl"
              [dateFormat]="dateFormat"
              [showIcon]="true"
              [firstDayOfWeek]="1"
              appendTo="body"
            ></p-calendar>
          </div>
          <div fxLayout="row" fxLayoutGap="1rem" fxLayoutAlign=" center">
            <label>{{ 'OperationAmountBetween' | translate }}</label>
            <p-inputNumber
              [formControl]="amountLowerBoundControl"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [useGrouping]="false"
              suffix=" €"
            ></p-inputNumber>
            <label>{{ 'And' | translate | lowercase }}</label>
            <p-inputNumber
              [formControl]="amountUpperBoundControl"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [useGrouping]="false"
              suffix=" €"
            ></p-inputNumber>
          </div>
          <div fxLayout="row" fxLayoutAlign="space-between">
            <div fxLayout="row" fxLayoutGap="1rem">
              <p-triStateCheckbox
                label="{{ 'PaidWithCreditCard' | translate }}"
                [formControl]="paidWithCreditCardControl"
              ></p-triStateCheckbox>
              <p-triStateCheckbox
                label="{{ 'CreditCardStatementIssued' | translate }}"
                [formControl]="creditCardStatementIssuedControl"
              ></p-triStateCheckbox>
              <p-triStateCheckbox
                label="{{ 'Checked' | translate }}"
                [formControl]="checkedControl"
              ></p-triStateCheckbox>
            </div>
            <div fxLayout="row" fxLayoutGap="1rem">
              <button
                pButton
                pRipple
                type="button"
                icon="pi pi-filter"
                class="p-button-rounded p-button-info p-button-text"
                (click)="applyFilters()"
              ></button>
              <button
                pButton
                pRipple
                type="button"
                icon="pi pi-filter-slash"
                class="p-button-rounded p-button-info p-button-text"
                (click)="resetFilters()"
              ></button>
            </div>
          </div>
        </form>
      </p-accordionTab>
    </p-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  readonly dateFormat = CALENDAR_DATE_FORMAT;

  dateLowerBoundControl = new FormControl();
  dateUpperBoundControl = new FormControl();
  amountLowerBoundControl = new FormControl();
  amountUpperBoundControl = new FormControl();
  paidWithCreditCardControl = new FormControl();
  creditCardStatementIssuedControl = new FormControl();
  checkedControl = new FormControl();
  filterGroup = new FormGroup({
    dateLowerBound: this.dateLowerBoundControl,
    dateUpperBound: this.dateUpperBoundControl,
    amountLowerBound: this.amountLowerBoundControl,
    amountUpperBound: this.amountUpperBoundControl,
    paidWithCreditCard: this.paidWithCreditCardControl,
    creditCardStatementIssued: this.creditCardStatementIssuedControl,
    checkedForm: this.checkedControl,
  });

  @Output()
  filtersSelected = new EventEmitter<Filters>();

  applyFilters(): void {
    this.filtersSelected.emit(this.filterGroup.value);
  }

  resetFilters(): void {
    this.filterGroup.reset();
    this.applyFilters();
  }
}
