export interface Filters {
  dateLowerBound?: Date;
  dateUpperBound?: Date;
  amountLowerBound?: number;
  amountUpperBound?: number;
  paidWithCreditCard?: boolean;
  creditCardStatementIssued?: boolean;
  checked?: boolean;
}
