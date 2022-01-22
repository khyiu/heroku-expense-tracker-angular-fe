import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'het-expense-form',
  template: `
    <form [formGroup]="expenseForm" autocomplete="off">
      <div fxLayout="row" fxLayoutAlign="none center" fxLayoutGap="1rem">
        <label for="expenseDate">{{ 'Date' | translate }}</label>
        <p-calendar
          inputId="expenseDate"
          [formControl]="dateControl"
          [dateFormat]="dateFormat"
          [defaultDate]="currentDate"
          [showIcon]="true"
          appendTo="body"
        ></p-calendar>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseModalFormComponent {
  private readonly amountPattern = '^[+-]?\\d+(\\.\\d{1,2})?$';

  readonly dateFormat = 'dd/mm/yy';
  readonly currentDate = new Date();

  dateControl = new FormControl(this.currentDate, Validators.required);
  amountControl = new FormControl(null, Validators.pattern(this.amountPattern));
  expenseForm = new FormGroup({
    date: this.dateControl,
    amount: this.amountControl,
  });


  constructor(private config: PrimeNGConfig, private readonly translateService: TranslateService) {
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
