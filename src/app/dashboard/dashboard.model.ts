import { Tag } from '../generated-sources/expense-api';

export interface Filters {
  dateLowerBound?: Date;
  dateUpperBound?: Date;
  amountLowerBound?: number;
  amountUpperBound?: number;
  paidWithCreditCard?: boolean;
  creditCardStatementIssued?: boolean;
  checked?: boolean;
  tags?: Tag[];
  descriptions?: string[];
}
