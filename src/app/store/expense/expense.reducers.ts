import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ExpenseResponse } from '../../generated-sources/expense-api';
import * as ExpenseActions from './expense.actions';

export interface ExpenseQuery {
  pageSize: number;
  pageNumber: number;
  sortDirection: 'ASC' | 'DESC';
  sortBy: 'DATE' | 'AMOUNT';
  tagFilters?: Array<string>;
  descriptionFilter?: string;
  paidWithCreditCardFilter?: boolean;
  creditCardStatementIssuedFilter?: boolean;
}

export interface State extends EntityState<ExpenseResponse> {
  pendingRequest: boolean;
  query: ExpenseQuery | null;
  totalNumberOfItems: number | null;
}

export const expenseResponseEntityAdapter: EntityAdapter<ExpenseResponse> =
  createEntityAdapter<ExpenseResponse>();

export const initialState: State = expenseResponseEntityAdapter.getInitialState(
  {
    pendingRequest: false,
    query: null,
    totalNumberOfItems: null,
    entities: expenseResponseEntityAdapter.getInitialState(),
  }
);

export const expenseReducer = createReducer(
  initialState,
  on(ExpenseActions.fetchExpensePage, (state, action) => ({
    ...state,
    pendingRequest: true,
    query: action.query,
  })),
  on(ExpenseActions.ExpensePageFetched, (state, action) =>
    expenseResponseEntityAdapter.setAll(action.items, {
      ...state,
      pendingRequest: false,
      totalNumberOfItems: action.totalNumberOfItems,
    })
  )
);
