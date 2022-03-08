import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
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

@UntilDestroy()
@Component({
  selector: 'het-expense-form',
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
              mode="currency"
              inputId="expenseAmount"
              currency="EUR"
              locale="fr-BE"
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
})
export class ExpenseModalFormComponent implements OnInit {
  readonly amountPattern = '^[+-]?\\d+(\\.\\d{1,2})?$';
  readonly dateFormat = 'dd/mm/yy';
  readonly currentDate = new Date();
  readonly labelWidth = 20;

  dateControl = new FormControl(this.currentDate, Validators.required);
  amountControl = new FormControl(null, Validators.pattern(this.amountPattern));
  tagsControl = new FormControl(null, Validators.required);
  descriptionControl = new FormControl(null, Validators.maxLength(1024));
  creditCardControl = new FormControl();
  creditCardStatementControl = new FormControl();
  expenseForm = new FormGroup({
    date: this.dateControl,
    amount: this.amountControl,
    tags: this.tagsControl,
    description: this.descriptionControl,
    creditCard: this.creditCardControl,
    creditCardStatement: this.creditCardStatementControl,
  });

  previouslyUsedTags$: Observable<Tag[]> = of([]);

  private existingExpenseId: string;

  constructor(
    private readonly config: PrimeNGConfig,
    private readonly translateService: TranslateService,
    private readonly expenseFacade: ExpenseFacade,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dialogConfig: DynamicDialogConfig,
    private readonly tagFacade: TagFacade
  ) {
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
