import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CALENDAR_DATE_FORMAT } from '../shared/shared.constants';
import { FormControl, FormGroup } from '@angular/forms';
import { Filters } from './dashboard.model';
import { TagFacade } from '../store/tag/tag.facade';

@Component({
  selector: 'het-filter',
  template: `
    <p-accordion>
      <p-accordionTab header="{{ 'Filters' | translate }}">
        <form [formGroup]="filterGroup" fxLayout="column" fxLayoutGap="0.5rem">
          <div fxLayout="row" fxLayoutGap="2rem">
            <div
              fxLayout="row"
              fxLayoutAlign=" center"
              fxLayoutGap="1rem"
              fxFlex="48"
            >
              <label for="tags">{{ 'Description' | translate }}</label>
              <input
                type="text"
                pInputText
                fxFlex="1 1 auto"
                [formControl]="descriptionControl"
              />
            </div>
            <div
              fxLayout="row"
              fxLayoutGap="1rem"
              fxLayoutAlign=" center"
              fxFlex="48"
            >
              <label>{{ 'Tags' | translate }}</label>
              <div fxFlex="1 1 auto" class="p-fluid">
                <p-autoComplete
                  [formControl]="tagsControl"
                  [multiple]="true"
                  [suggestions]="tags$ | async"
                  [field]="'value'"
                  [ngClass]="{
                    'ng-invalid ng-dirty':
                      tagsControl.touched && tagsControl.invalid
                  }"
                  (completeMethod)="fetchTags($event)"
                >
                </p-autoComplete>
              </div>
            </div>
          </div>
          <div fxLayout="row" fxLayoutGap="1rem" fxLayoutAlign=" center">
            <label fxFlex="15">{{ 'OperationDateBetween' | translate }}</label>
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
            <label fxFlex="15">{{
              'OperationAmountBetween' | translate
            }}</label>
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

  descriptionControl = new FormControl();
  tagsControl = new FormControl();
  dateLowerBoundControl = new FormControl();
  dateUpperBoundControl = new FormControl();
  amountLowerBoundControl = new FormControl();
  amountUpperBoundControl = new FormControl();
  paidWithCreditCardControl = new FormControl();
  creditCardStatementIssuedControl = new FormControl();
  checkedControl = new FormControl();
  filterGroup = new FormGroup({
    description: this.descriptionControl,
    tags: this.tagsControl,
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

  tags$ = this.tagFacade.tags$;

  constructor(private readonly tagFacade: TagFacade) {}

  applyFilters(): void {
    this.filtersSelected.emit(this.filterGroup.value);
  }

  resetFilters(): void {
    this.filterGroup.reset();
    this.applyFilters();
  }

  fetchTags(tagQuery: string): void {
    this.tagFacade.fetchTags(tagQuery);
  }
}
