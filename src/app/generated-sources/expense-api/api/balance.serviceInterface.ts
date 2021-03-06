/**
 * Heroku Expense Tracker
 * API for Heroku Expense Tracker, a hobby project to manage personal expenses
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Configuration } from '../configuration';

export interface BalanceServiceInterface {
  defaultHeaders: HttpHeaders;
  configuration: Configuration;

  /**
   * Retrieve balance
   * Retrieve the sum of the current user\&#39;s expenses amount
   */
  getBalance(extraHttpRequestParams?: any): Observable<number>;
}
