import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ExpenseResponse } from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';

export type SortDirection = 'ASC' | 'DESC';
export type SortAttribute = 'DATE' | 'AMOUNT';

export interface ExpenseQuery {
  pageSize: number;
  pageNumber: number;
  sortDirection: SortDirection;
  sortBy: SortAttribute;
  tagFilters?: Array<string>;
  descriptionFilter?: string;
  paidWithCreditCardFilter?: boolean;
  creditCardStatementIssuedFilter?: boolean;
}

export interface State extends EntityState<ExpenseResponse> {
  pendingReadRequest: boolean;
  pendingWriteRequest: boolean;
  query: ExpenseQuery | null;
  totalNumberOfItems: number | null;
}

export const expenseResponseEntityAdapter: EntityAdapter<ExpenseResponse> =
  createEntityAdapter<ExpenseResponse>();

export const initialState: State = expenseResponseEntityAdapter.getInitialState(
  {
    pendingReadRequest: false,
    pendingWriteRequest: false,
    query: null,
    totalNumberOfItems: null,
    entities: expenseResponseEntityAdapter.getInitialState(),
  }
);

export const expenseReducer = createReducer(
  initialState,
  on(ExpenseActions.fetchExpensePage, (state, action) => ({
    ...state,
    pendingReadRequest: true,
    query: action.query,
  })),
  on(ExpenseActions.expensePageFetched, (state, action) =>
    expenseResponseEntityAdapter.setAll(action.items, {
      ...state,
      pendingReadRequest: false,
      totalNumberOfItems: action.totalNumberOfItems,
    })
  ),
  on(ExpenseActions.createExpense, (state) => ({
    ...state,
    pendingWriteRequest: true,
  })),
  on(ExpenseActions.expenseCreated, (state) => ({
    ...state,
    pendingWriteRequest: false,
  }))
);
