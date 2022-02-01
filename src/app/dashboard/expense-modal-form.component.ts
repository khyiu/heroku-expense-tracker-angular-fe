import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

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
          <het-form-field-error fxFlexOffset="20" [errors]="dateControl.errors"></het-form-field-error>
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
        <div fxLayout="row" *ngIf="amountControl.touched && amountControl.invalid">
          <het-form-field-error fxFlexOffset="20" [errors]="amountControl.errors"></het-form-field-error>
        </div>
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
  expenseForm = new FormGroup({
    date: this.dateControl,
    amount: this.amountControl,
  });

  constructor(
    private config: PrimeNGConfig,
    private readonly translateService: TranslateService
  ) {
    this.translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }
}
