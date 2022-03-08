import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Tag } from '../../generated-sources/expense-api';
import { createReducer, on } from '@ngrx/store';
import * as TagActions from './tag.actions';

export const tagEntityAdapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();

export interface State extends EntityState<Tag> {
  pendingRequest: boolean;
  query: string;
}

export const initialState: State = tagEntityAdapter.getInitialState({
  pendingRequest: false,
  query: null,
});

export const tagReducer = createReducer(
  initialState,
  on(TagActions.fetchTags, (state, action) => ({
    ...state,
    pendingRequest: true,
    query: action.query,
  })),
  on(TagActions.tagsFetched, (state, action) =>
    tagEntityAdapter.setAll(action.tags, { ...state, pendingRequest: false })
  )
);
