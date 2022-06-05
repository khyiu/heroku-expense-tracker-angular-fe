export interface Filters {
  dateLowerBound?: Date;
  dateUpperBound?: Date;
  amountLowerBound?: number;
  amountUpperBound?: number;
  paidWithCreditCard?: boolean;
  creditCardStatementIssued?: boolean;
  checked?: boolean;
  tags?: [{ id: string }];
  descriptions?: string[];
}
