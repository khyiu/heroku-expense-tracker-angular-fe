import { FormControl } from '@angular/forms';
import { Tag } from '../generated-sources/expense-api';

export interface ExpenseForm {
  date: FormControl<Date>;
  amount: FormControl<number>;
  tags: FormControl<Tag[]>;
  description: FormControl<string>;
  creditCard: FormControl<boolean>;
  creditCardStatement: FormControl<boolean>;
}

export interface FilterForm {
  descriptions: FormControl<string[]>;
  tags: FormControl<Tag[]>;
  dateLowerBound: FormControl<Date>;
  dateUpperBound: FormControl<Date>;
  amountLowerBound: FormControl<number>;
  amountUpperBound: FormControl<number>;
  paidWithCreditCard: FormControl<boolean>;
  creditCardStatementIssued: FormControl<boolean>;
  checked: FormControl<boolean>;
}
