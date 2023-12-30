import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CALENDAR_DATE_FORMAT } from '../shared/shared.constants';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Filters } from './dashboard.model';
import { TagFacade } from '../store/tag/tag.facade';
import { ExpenseFilteringQuery } from '../store/expense/expense.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take, tap } from 'rxjs';
import { Tag } from '../generated-sources/expense-api';
import { FilterForm } from './model';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule } from '@ngx-translate/core';
import { ChipsModule } from 'primeng/chips';
import { AsyncPipe, LowerCasePipe, NgClass } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PaginatorModule } from 'primeng/paginator';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { RippleModule } from 'primeng/ripple';

@UntilDestroy()
@Component({
  selector: 'het-filter',
  standalone: true,
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
              <div class="p-fluid" fxFlex="1 1 auto">
                <p-chips
                  [formControl]="descriptionsControl"
                  [showClear]="true"
                ></p-chips>
              </div>
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
              prefix="€ "
            ></p-inputNumber>
            <label>{{ 'And' | translate | lowercase }}</label>
            <p-inputNumber
              [formControl]="amountUpperBoundControl"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [useGrouping]="false"
              prefix="€ "
            ></p-inputNumber>
          </div>
          <div fxLayout="row" fxLayoutAlign="space-between">
            <div fxLayout="row" fxLayoutGap="1rem">
              <div fxLayout="row" fxLayoutGap="0.5rem">
                <p-triStateCheckbox
                  inputId="paidWithCreditCard"
                  [formControl]="paidWithCreditCardControl"
                ></p-triStateCheckbox>
                <label for="paidWithCreditCard">{{
                  'PaidWithCreditCard' | translate
                }}</label>
              </div>
              <div fxLayout="row" fxLayoutGap="0.5rem">
                <p-triStateCheckbox
                  inputId="creditCardStatementIssued"
                  [formControl]="creditCardStatementIssuedControl"
                ></p-triStateCheckbox>
                <label for="creditCardStatementIssued">{{
                  'CreditCardStatementIssued' | translate
                }}</label>
              </div>
              <div fxLayout="row" fxLayoutGap="0.5rem">
                <p-triStateCheckbox
                  inputId="expenseChecked"
                  [formControl]="checkedControl"
                ></p-triStateCheckbox>
                <label for="expenseChecked">{{ 'Checked' | translate }}</label>
              </div>
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
  imports: [
    AccordionModule,
    ReactiveFormsModule,
    TranslateModule,
    ChipsModule,
    AutoCompleteModule,
    AsyncPipe,
    NgClass,
    CalendarModule,
    FlexLayoutModule,
    LowerCasePipe,
    PaginatorModule,
    TriStateCheckboxModule,
    RippleModule,
  ],
})
export class FilterComponent implements OnChanges {
  readonly dateFormat = CALENDAR_DATE_FORMAT;

  descriptionsControl = new FormControl<string[]>(null);
  tagsControl = new FormControl<Tag[]>(null);
  dateLowerBoundControl = new FormControl<Date>(null);
  dateUpperBoundControl = new FormControl<Date>(null);
  amountLowerBoundControl = new FormControl<number>(null);
  amountUpperBoundControl = new FormControl<number>(null);
  paidWithCreditCardControl = new FormControl<boolean>(null);
  creditCardStatementIssuedControl = new FormControl<boolean>(null);
  checkedControl = new FormControl<boolean>(null);
  filterGroup = new FormGroup<FilterForm>({
    descriptions: this.descriptionsControl,
    tags: this.tagsControl,
    dateLowerBound: this.dateLowerBoundControl,
    dateUpperBound: this.dateUpperBoundControl,
    amountLowerBound: this.amountLowerBoundControl,
    amountUpperBound: this.amountUpperBoundControl,
    paidWithCreditCard: this.paidWithCreditCardControl,
    creditCardStatementIssued: this.creditCardStatementIssuedControl,
    checked: this.checkedControl,
  });

  @Input()
  currentFilter: ExpenseFilteringQuery | null;

  @Output()
  filtersSelected = new EventEmitter<Filters>();

  tags$ = this.tagFacade.tags$;

  constructor(private readonly tagFacade: TagFacade) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentFilter) {
      const currentFilteringQuery = changes.currentFilter
        .currentValue as ExpenseFilteringQuery;

      this.tagFacade.fetchTags();
      this.tagFacade.tags$
        .pipe(
          untilDestroyed(this),
          filter((tags: Tag[]) => !!tags.length),
          take(1),
          tap((tags: Tag[]) =>
            this.tagsControl.patchValue(
              tags.filter((tag) =>
                currentFilteringQuery.tagFilters.some(
                  (tagFilter) => tag.id === tagFilter
                )
              )
            )
          )
        )
        .subscribe();

      this.filterGroup.patchValue({
        descriptions: currentFilteringQuery.descriptionFilters,
        dateLowerBound:
          currentFilteringQuery.inclusiveDateLowerBound &&
          new Date(currentFilteringQuery.inclusiveDateLowerBound),
        dateUpperBound:
          currentFilteringQuery.inclusiveDateUpperBound &&
          new Date(currentFilteringQuery.inclusiveDateUpperBound),
        amountLowerBound: currentFilteringQuery.inclusiveAmountLowerBound,
        amountUpperBound: currentFilteringQuery.inclusiveAmountUpperBound,
        paidWithCreditCard: currentFilteringQuery.paidWithCreditCardFilter,
        creditCardStatementIssued:
          currentFilteringQuery.creditCardStatementIssuedFilter,
        checked: currentFilteringQuery.checked,
      });
    }
  }

  applyFilters(): void {
    this.filtersSelected.emit(this.filterGroup.value);
  }

  resetFilters(): void {
    this.filterGroup.reset();
    this.applyFilters();
  }

  fetchTags(autoCompleteEvent: AutoCompleteCompleteEvent): void {
    this.tagFacade.fetchTags(autoCompleteEvent.query);
  }
}
