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
import { ExpenseResponse } from './expenseResponse';


/**
 * Paginated response that is returned to the user upon retrieval of his expenses
 */
export interface ExpenseListResponse { 
    pageNumber: number;
    pageSize: number;
    totalNumberOfItems: number;
    items: Array<ExpenseResponse>;
}

