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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
  HttpContext,
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

import { ExpenseListResponse } from '../model/models';
import { ExpenseRequest } from '../model/models';
import { ExpenseResponse } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';
import { ExpensesServiceInterface } from './expenses.serviceInterface';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService implements ExpensesServiceInterface {
  protected basePath = 'https://heroku-expense-tracker-back.herokuapp.com';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  private addToHttpParams(
    httpParams: HttpParams,
    value: any,
    key?: string
  ): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(
    httpParams: HttpParams,
    value?: any,
    key?: string
  ): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(
          (elem) =>
            (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key))
        );
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(
            key,
            (value as Date).toISOString().substr(0, 10)
          );
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) =>
            (httpParams = this.addToHttpParamsRecursive(
              httpParams,
              value[k],
              key != null ? `${key}.${k}` : k
            ))
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

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
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getExpenses(
    pageSize: number,
    pageNumber: number,
    sortDirection: 'ASC' | 'DESC',
    sortBy: 'DATE' | 'AMOUNT',
    tagFilters?: Array<string>,
    descriptionFilter?: string,
    paidWithCreditCardFilter?: boolean,
    creditCardStatementIssuedFilter?: boolean,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<ExpenseListResponse>;
  public getExpenses(
    pageSize: number,
    pageNumber: number,
    sortDirection: 'ASC' | 'DESC',
    sortBy: 'DATE' | 'AMOUNT',
    tagFilters?: Array<string>,
    descriptionFilter?: string,
    paidWithCreditCardFilter?: boolean,
    creditCardStatementIssuedFilter?: boolean,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<ExpenseListResponse>>;
  public getExpenses(
    pageSize: number,
    pageNumber: number,
    sortDirection: 'ASC' | 'DESC',
    sortBy: 'DATE' | 'AMOUNT',
    tagFilters?: Array<string>,
    descriptionFilter?: string,
    paidWithCreditCardFilter?: boolean,
    creditCardStatementIssuedFilter?: boolean,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<ExpenseListResponse>>;
  public getExpenses(
    pageSize: number,
    pageNumber: number,
    sortDirection: 'ASC' | 'DESC',
    sortBy: 'DATE' | 'AMOUNT',
    tagFilters?: Array<string>,
    descriptionFilter?: string,
    paidWithCreditCardFilter?: boolean,
    creditCardStatementIssuedFilter?: boolean,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    if (pageSize === null || pageSize === undefined) {
      throw new Error(
        'Required parameter pageSize was null or undefined when calling getExpenses.'
      );
    }
    if (pageNumber === null || pageNumber === undefined) {
      throw new Error(
        'Required parameter pageNumber was null or undefined when calling getExpenses.'
      );
    }
    if (sortDirection === null || sortDirection === undefined) {
      throw new Error(
        'Required parameter sortDirection was null or undefined when calling getExpenses.'
      );
    }
    if (sortBy === null || sortBy === undefined) {
      throw new Error(
        'Required parameter sortBy was null or undefined when calling getExpenses.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (pageSize !== undefined && pageSize !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>pageSize,
        'pageSize'
      );
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>pageNumber,
        'pageNumber'
      );
    }
    if (sortDirection !== undefined && sortDirection !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>sortDirection,
        'sortDirection'
      );
    }
    if (sortBy !== undefined && sortBy !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>sortBy,
        'sortBy'
      );
    }
    if (tagFilters) {
      tagFilters.forEach((element) => {
        localVarQueryParameters = this.addToHttpParams(
          localVarQueryParameters,
          <any>element,
          'tagFilters'
        );
      });
    }
    if (descriptionFilter !== undefined && descriptionFilter !== null) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>descriptionFilter,
        'descriptionFilter'
      );
    }
    if (
      paidWithCreditCardFilter !== undefined &&
      paidWithCreditCardFilter !== null
    ) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>paidWithCreditCardFilter,
        'paidWithCreditCardFilter'
      );
    }
    if (
      creditCardStatementIssuedFilter !== undefined &&
      creditCardStatementIssuedFilter !== null
    ) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        <any>creditCardStatementIssuedFilter,
        'creditCardStatementIssuedFilter'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Accept',
        localVarHttpHeaderAcceptSelected
      );
    }

    let localVarHttpContext: HttpContext | undefined =
      options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      localVarHttpHeaderAcceptSelected &&
      localVarHttpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.get<ExpenseListResponse>(
      `${this.configuration.basePath}/expenses`,
      {
        context: localVarHttpContext,
        params: localVarQueryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Register an expense.
   * Registers an expense
   * @param expenseRequest
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public registerExpense(
    expenseRequest: ExpenseRequest,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<ExpenseResponse>;
  public registerExpense(
    expenseRequest: ExpenseRequest,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<ExpenseResponse>>;
  public registerExpense(
    expenseRequest: ExpenseRequest,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<ExpenseResponse>>;
  public registerExpense(
    expenseRequest: ExpenseRequest,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    if (expenseRequest === null || expenseRequest === undefined) {
      throw new Error(
        'Required parameter expenseRequest was null or undefined when calling registerExpense.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Accept',
        localVarHttpHeaderAcceptSelected
      );
    }

    let localVarHttpContext: HttpContext | undefined =
      options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Content-Type',
        httpContentTypeSelected
      );
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      localVarHttpHeaderAcceptSelected &&
      localVarHttpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.post<ExpenseResponse>(
      `${this.configuration.basePath}/expenses`,
      expenseRequest,
      {
        context: localVarHttpContext,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
