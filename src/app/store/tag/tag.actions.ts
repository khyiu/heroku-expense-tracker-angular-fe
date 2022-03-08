import { createAction, props } from '@ngrx/store';
import { Tag } from '../../generated-sources/expense-api';

export const fetchTags = createAction(
  '[Tag] Fetch',
  props<{ query: string }>()
);

export const tagsFetched = createAction(
  '[Tag] Fetched',
  props<{ tags: Tag[] }>()
);

export const tagError = createAction('[Tag] Error');
