/**
 * Heroku Expense Tracker
 * API for Heroku Expense Tracker, a hobby project to manage personal expenses
 *
 * The version of the OpenAPI document: 1.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ExpenseListResponse } from '../model/models';
import { ExpenseRequest } from '../model/models';
import { ExpenseResponse } from '../model/models';

import { Configuration } from '../configuration';

export interface ExpensesServiceInterface {
  defaultHeaders: HttpHeaders;
  configuration: Configuration;

  /**
   * Retrieve expenses
   * Retrieves expenses belonging to the current user, in a paginated way. This operation also supports filtering based on tag(s) and partial description
   * @param pageSize
   * @param pageNumber
   * @param sortDirection
   * @param sortBy
   * @param tagFilters
   * @param descriptionFilter
   * @param paidWithCreditCardFilter
   * @param creditCardStatementIssuedFilter
   */
  getExpenses(
    pageSize: number,
    pageNumber: number,
    sortDirection: 'ASC' | 'DESC',
    sortBy: 'DATE' | 'AMOUNT',
    tagFilters?: Array<string>,
    descriptionFilter?: string,
    paidWithCreditCardFilter?: boolean,
    creditCardStatementIssuedFilter?: boolean,
    extraHttpRequestParams?: any
  ): Observable<ExpenseListResponse>;

  /**
   * Register an expense.
   * Registers an expense
   * @param expenseRequest
   */
  registerExpense(
    expenseRequest: ExpenseRequest,
    extraHttpRequestParams?: any
  ): Observable<ExpenseResponse>;
}
