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

/**
 * Request object representing an expense to be registered in the application
 */
export interface ExpenseRequest {
  date: string;
  amount: number;
  tags: Array<string>;
  description?: string;
  paidWithCreditCard?: boolean;
  creditCardStatementIssued?: boolean;
  version?: number;
}