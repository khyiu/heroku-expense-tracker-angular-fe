import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ExpenseResponse } from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';

export type SortDirection = 'ASC' | 'DESC';
export type SortAttribute = 'DATE' | 'AMOUNT';

export interface ExpensePaginationQuery {
  pageSize: number;
  pageNumber: number;
  sortDirection: SortDirection;
  sortBy: SortAttribute;
}

export interface ExpenseFilteringQuery {
  tagFilters?: Array<string>;
  descriptionFilters?: Array<string>;
  paidWithCreditCardFilter?: boolean;
  creditCardStatementIssuedFilter?: boolean;
  checked?: boolean;
  inclusiveDateLowerBound?: string;
  inclusiveDateUpperBound?: string;
  inclusiveAmountLowerBound?: number;
  inclusiveAmountUpperBound?: number;
}

export interface State extends EntityState<ExpenseResponse> {
  pendingReadRequest: boolean;
  pendingWriteRequest: boolean;
  pendingImportRequest: boolean;
  pendingExportRequest: boolean;
  paginationQuery: ExpensePaginationQuery | null;
  filteringQuery: ExpenseFilteringQuery | null;
  totalNumberOfItems: number | null;
}

export const expenseResponseEntityAdapter: EntityAdapter<ExpenseResponse> =
  createEntityAdapter<ExpenseResponse>();

export const initialState: State = expenseResponseEntityAdapter.getInitialState(
  {
    pendingReadRequest: false,
    pendingWriteRequest: false,
    pendingImportRequest: false,
    pendingExportRequest: false,
    paginationQuery: null,
    filteringQuery: null,
    totalNumberOfItems: null,
    entities: expenseResponseEntityAdapter.getInitialState(),
  }
);

export const expenseReducer = createReducer(
  initialState,
  on(ExpenseActions.fetchExpensePage, (state, action) => ({
    ...state,
    pendingReadRequest: true,
    paginationQuery: action.paginationQuery,
    filteringQuery: action.filteringQuery,
  })),
  on(
    ExpenseActions.expensePageFetched,
    ExpenseActions.currentPageRefreshed,
    (state, action) =>
      expenseResponseEntityAdapter.setAll(action.items, {
        ...state,
        pendingReadRequest: false,
        totalNumberOfItems: action.totalNumberOfItems,
      })
  ),
  on(
    ExpenseActions.createExpense,
    ExpenseActions.deleteExpense,
    ExpenseActions.updateExpense,
    ExpenseActions.updateExpensesStatus,
    (state) => ({
      ...state,
      pendingWriteRequest: true,
    })
  ),
  on(ExpenseActions.importExpenses, (state) => ({
    ...state,
    pendingImportRequest: true,
  })),
  on(ExpenseActions.expenseCreated, ExpenseActions.expenseDeleted, (state) => ({
    ...state,
    pendingWriteRequest: false,
  })),
  on(ExpenseActions.expensesImported, (state) => ({
    ...state,
    pendingImportRequest: false,
  })),
  on(ExpenseActions.refreshCurrentPage, (state) => ({
    ...state,
    pendingReadRequest: true,
  })),
  on(ExpenseActions.expenseUpdated, (state, action) =>
    expenseResponseEntityAdapter.upsertOne(action.expenseResponse, {
      ...state,
      pendingWriteRequest: false,
    })
  ),
  on(ExpenseActions.expensesStatusUpdated, (state, action) =>
    expenseResponseEntityAdapter.upsertMany(action.expenses, {
      ...state,
      pendingWriteRequest: false,
    })
  ),
  on(ExpenseActions.exportExpenses, (state) => ({
    ...state,
    pendingExportRequest: true,
  })),
  on(ExpenseActions.expensesExported, (state) => ({
    ...state,
    pendingExportRequest: false,
  }))
);
