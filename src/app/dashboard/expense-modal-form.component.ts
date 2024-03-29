import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, map, Observable, of, take, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExpenseFacade } from '../store/expense/expense.facade';
import {
  ExpenseRequest,
  ExpenseResponse,
  Tag,
} from '../generated-sources/expense-api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TagFacade } from '../store/tag/tag.facade';
import { CALENDAR_DATE_FORMAT } from '../shared/shared.constants';
import { ExpenseForm } from './model';
import { FlexModule } from '@angular/flex-layout';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { FormFieldErrorComponent } from '../shared/form-field-error/form-field-error.component';
import { RequiredIndicatorPipe } from '../shared/required-indicator.pipe';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'het-expense-form',
  standalone: true,
  template: `
    <form [formGroup]="expenseForm" autocomplete="off">
      <div fxLayout="column" fxLayoutGap="1.5rem">
        <div fxLayout="column" fxLayoutGap="1rem">
          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
            <label for="expenseDate" [fxFlex]="labelWidth">{{
              'Date' | translate | requiredIndicator
            }}</label>
            <p-calendar
              inputId="expenseDate"
              [formControl]="dateControl"
              [dateFormat]="dateFormat"
              [defaultDate]="currentDate"
              [showIcon]="true"
              [firstDayOfWeek]="1"
              [required]="true"
              appendTo="body"
            ></p-calendar>
          </div>
          <div
            fxLayout="row"
            *ngIf="dateControl.touched && dateControl.invalid"
          >
            <het-form-field-error
              fxFlexOffset="23"
              [errors]="dateControl.errors"
            ></het-form-field-error>
          </div>
          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
            <label for="expenseAmount" [fxFlex]="labelWidth">{{
              'Amount' | translate | requiredIndicator
            }}</label>
            <p-inputNumber
              [formControl]="amountControl"
              [required]="true"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [useGrouping]="false"
              prefix="€ "
              inputId="expenseAmount"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  amountControl.touched && amountControl.invalid
              }"
            ></p-inputNumber>
          </div>
          <div
            fxLayout="row"
            *ngIf="amountControl.touched && amountControl.invalid"
          >
            <het-form-field-error
              fxFlexOffset="23"
              [errors]="amountControl.errors"
            ></het-form-field-error>
          </div>
          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
            <label for="tags" [fxFlex]="labelWidth">{{
              'Tags' | translate | requiredIndicator
            }}</label>
            <div fxFlex="80" class="p-fluid">
              <p-autoComplete
                [formControl]="tagsControl"
                [multiple]="true"
                [suggestions]="previouslyUsedTags$ | async"
                [field]="'value'"
                [ngClass]="{
                  'ng-invalid ng-dirty':
                    tagsControl.touched && tagsControl.invalid
                }"
                (completeMethod)="fetchPreviouslyUsedTags($event)"
              >
              </p-autoComplete>
            </div>
          </div>
          <div
            fxLayout="row"
            *ngIf="tagsControl.touched && tagsControl.invalid"
          >
            <het-form-field-error
              fxFlexOffset="23"
              [errors]="tagsControl.errors"
            ></het-form-field-error>
          </div>

          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
            <label for="tags" [fxFlex]="labelWidth">{{
              'Description' | translate
            }}</label>
            <textarea
              pInputTextarea
              fxFlex="80"
              [formControl]="descriptionControl"
              [autoResize]="true"
              [maxlength]="1024"
              [rows]="5"
            ></textarea>
          </div>
          <div
            fxLayout="row"
            *ngIf="descriptionControl.touched && descriptionControl.invalid"
          >
            <het-form-field-error
              fxFlexOffset="23"
              [errors]="descriptionControl.errors"
            ></het-form-field-error>
          </div>
          <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
            <div fxLayout="row" fxLayoutGap="1rem">
              <label for="creditCard">{{
                'PaidWithCreditCard' | translate
              }}</label>
              <p-checkbox
                [formControl]="creditCardControl"
                [binary]="true"
                inputId="creditCard"
              ></p-checkbox>
            </div>
            <div fxLayout="row" fxLayoutGap="1rem">
              <label for="creditCardStatement">{{
                'CreditCardStatementIssued' | translate
              }}</label>
              <p-checkbox
                [formControl]="creditCardStatementControl"
                [binary]="true"
                inputId="creditCardStatement"
              ></p-checkbox>
            </div>
          </div>
        </div>
        <div fxLayout="row" fxLayoutAlign="end">
          <button
            pButton
            pRipple
            type="button"
            label="{{ 'Save' | translate }}"
            class="p-button-outlined"
            icon="pi pi-plus"
            (click)="save()"
          ></button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FlexModule,
    TranslateModule,
    CalendarModule,
    PaginatorModule,
    AutoCompleteModule,
    InputTextareaModule,
    CheckboxModule,
    RippleModule,
    FormFieldErrorComponent,
    RequiredIndicatorPipe,
    AsyncPipe,
    NgClass,
    NgIf,
  ],
})
export class ExpenseModalFormComponent implements OnInit {
  private readonly config = inject(PrimeNGConfig);
  private readonly translateService = inject(TranslateService);
  private readonly expenseFacade = inject(ExpenseFacade);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly tagFacade = inject(TagFacade);

  readonly amountPattern = '^[+-]?\\d+(\\.\\d{1,2})?$';
  readonly dateFormat = CALENDAR_DATE_FORMAT;
  readonly currentDate = new Date();
  readonly labelWidth = 20;

  dateControl = new FormControl<Date>(this.currentDate, Validators.required);
  amountControl = new FormControl<number>(
    null,
    Validators.pattern(this.amountPattern)
  );
  tagsControl = new FormControl<Tag[]>(null, Validators.required);
  descriptionControl = new FormControl<string>(
    null,
    Validators.maxLength(1024)
  );
  creditCardControl = new FormControl<boolean>(null);
  creditCardStatementControl = new FormControl<boolean>(null);
  expenseForm = new FormGroup<ExpenseForm>({
    date: this.dateControl,
    amount: this.amountControl,
    tags: this.tagsControl,
    description: this.descriptionControl,
    creditCard: this.creditCardControl,
    creditCardStatement: this.creditCardStatementControl,
  });

  previouslyUsedTags$: Observable<Tag[]> = of([]);

  private existingExpenseId: string;

  constructor() {
    this.initCalendarLanguage();
    this.initCreditCardControlSubscriptions();
  }

  ngOnInit(): void {
    if (this.dialogConfig.data) {
      this.existingExpenseId = this.dialogConfig.data.id;
      this.initFormWithExistingExpense(this.dialogConfig.data);
    }
  }

  fetchPreviouslyUsedTags(event: {
    originalEvent: unknown;
    query: string;
  }): void {
    this.tagFacade.fetchTags(event.query);
    this.previouslyUsedTags$ = this.tagFacade.tags$.pipe(
      map((tags) => {
        if (!tags.find((tag) => tag.value === event.query)) {
          return tags.concat({ value: event.query });
        }

        return tags;
      })
    );
  }

  save(): void {
    if (this.expenseForm.valid) {
      const expenseRequest = this.extractForm();

      if (this.existingExpenseId) {
        this.expenseFacade.updateExpense(
          this.existingExpenseId,
          expenseRequest,
          this.dialogRef
        );
      } else {
        this.expenseFacade.createExpense(expenseRequest, this.dialogRef);
      }
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  private initCalendarLanguage(): void {
    this.translateService
      .get('primeng')
      .pipe(
        take(1),
        tap((res) => this.config.setTranslation(res))
      )
      .subscribe();
  }

  private initCreditCardControlSubscriptions(): void {
    this.creditCardControl.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((value) => !value),
        tap(() =>
          this.creditCardStatementControl.setValue(false, { emitEvent: false })
        )
      )
      .subscribe();

    this.creditCardStatementControl.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((value) => !!value),
        tap(() => this.creditCardControl.setValue(true, { emitEvent: false }))
      )
      .subscribe();
  }

  private initFormWithExistingExpense(expense: ExpenseResponse): void {
    this.expenseForm.patchValue({
      date: new Date(expense.date),
      amount: expense.amount,
      tags: expense.tags,
      description: expense.description,
      creditCard: expense.paidWithCreditCard,
      creditCardStatement: expense.creditCardStatementIssued,
    });
  }

  private extractForm(): ExpenseRequest {
    const expenseDate = <Date>this.dateControl.value;
    const tags: Tag[] = this.tagsControl.value;

    return {
      date: `${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1)
        .toString(10)
        .padStart(2, '0')}-${expenseDate
        .getDate()
        .toString(10)
        .padStart(2, '0')}`,
      amount: this.amountControl.value,
      tags,
      description: this.descriptionControl.value,
      paidWithCreditCard: this.creditCardControl.value,
      creditCardStatementIssued: this.creditCardStatementControl.value,
    };
  }
}
