import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TagActions from './tag.actions';
import { State } from './tag.reducers';
import { selectTags } from './tag.selectors';

@Injectable({providedIn: 'root'})
export class TagFacade {
  tags$ = this.store$.select(selectTags);

  constructor(private readonly store$: Store<State>) {}

  fetchTags(query?: string): void {
    this.store$.dispatch(TagActions.fetchTags({ query }));
  }
}
