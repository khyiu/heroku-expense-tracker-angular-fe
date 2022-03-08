import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, tagEntityAdapter } from './tag.reducers';
import { Features } from '../stores';

const selectFeature = createFeatureSelector<State>(Features.TAG);

export const selectTags = createSelector(
  selectFeature,
  tagEntityAdapter.getSelectors().selectAll
);
