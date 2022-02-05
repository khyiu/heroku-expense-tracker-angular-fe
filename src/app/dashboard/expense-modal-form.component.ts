import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { filter, Observable, of, take, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'het-expense-form',
  template: `
    <form [formGroup]="expenseForm" autocomplete="off">
      <div fxLayout="column" fxLayoutGap="1rem">
        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
          <label for="expenseDate">{{
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
        <div fxLayout="row" *ngIf="dateControl.touched && dateControl.invalid">
          <het-form-field-error
            fxFlexOffset="20"
            [errors]="dateControl.errors"
          ></het-form-field-error>
        </div>
        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
          <label for="expenseAmount">{{
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
            fxFlexOffset="20"
            [errors]="amountControl.errors"
          ></het-form-field-error>
        </div>
        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
          <label for="tags">{{ 'Tags' | translate | requiredIndicator }}</label>
          <p-autoComplete
            [suggestions]="previouslyUsedTags | async"
            (completeMethod)="fetchPreviouslyUsedTags($event)"
            [formControl]="tagsControl"
            [multiple]="true"
            [ngClass]="{
              'ng-invalid ng-dirty': tagsControl.touched && tagsControl.invalid
            }"
          >
          </p-autoComplete>
        </div>
        <div fxLayout="row" *ngIf="tagsControl.touched && tagsControl.invalid">
          <het-form-field-error
            fxFlexOffset="20"
            [errors]="tagsControl.errors"
          ></het-form-field-error>
        </div>

        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
          <label for="tags">{{ 'Description' | translate }}</label>
          <textarea
            [formControl]="descriptionControl"
            [rows]="5"
            [cols]="30"
            pInputTextarea
            [autoResize]="true"
            [maxlength]="1024"
          ></textarea>
        </div>
        <div
          fxLayout="row"
          *ngIf="descriptionControl.touched && descriptionControl.invalid"
        >
          <het-form-field-error
            fxFlexOffset="20"
            [errors]="descriptionControl.errors"
          ></het-form-field-error>
        </div>
        <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
          <div>
            <label for="creditCard">{{
              'PaidWithCreditCard' | translate
            }}</label>
            <p-checkbox
              [formControl]="creditCardControl"
              [binary]="true"
              inputId="creditCard"
            ></p-checkbox>
          </div>
          <div>
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
      <div fxLayout="row">
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
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseModalFormComponent {
  readonly amountPattern = '^[+-]?\\d+(\\.\\d{1,2})?$';

  readonly dateFormat = 'dd/mm/yy';
  readonly currentDate = new Date();

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

  previouslyUsedTags: Observable<string[]> = of([]);

  constructor(
    private config: PrimeNGConfig,
    private readonly translateService: TranslateService
  ) {
    this.initCalendarLanguage();
    this.initCreditCardControlSubscriptions();
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

  fetchPreviouslyUsedTags(event: {
    originalEvent: unknown;
    query: string;
  }): void {
    this.previouslyUsedTags = of([event.query]);
  }

  save(): void {
    // todo kyiu: implement
    if (this.expenseForm.valid) {
      console.log('>>> save expense', this.expenseForm.value);
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }
}
