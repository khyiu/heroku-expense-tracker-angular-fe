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

import { ExpenseRequest } from '../model/models';
import { ExpenseResponse } from '../model/models';

import { Configuration } from '../configuration';

export interface ExpenseServiceInterface {
  defaultHeaders: HttpHeaders;
  configuration: Configuration;

  /**
   * Delete an existing expense
   * Delete the expense that is identfied by &#x60;id&#x60;
   * @param id Identifier of the expense to be updated
   */
  deleteExpense(id: string, extraHttpRequestParams?: any): Observable<{}>;

  /**
   * Retrieve an expense based on its identifier
   * Fetch the expense that is identitied by &#x60;id&#x60; and belongs to the current user
   * @param id Identifier of the expense to be retrieved
   */
  getExpense(
    id: string,
    extraHttpRequestParams?: any
  ): Observable<ExpenseResponse>;

  /**
   * Update an existing expense
   * Update the expense that is identified by &#x60;id&#x60; and belongs to the current user
   * @param id Identifier of the expense to be updated
   * @param expenseRequest
   */
  updateExpense(
    id: string,
    expenseRequest: ExpenseRequest,
    extraHttpRequestParams?: any
  ): Observable<ExpenseResponse>;
}
