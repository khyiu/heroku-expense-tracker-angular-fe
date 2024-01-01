import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TagActions from './tag.actions';
import { selectTags } from './tag.selectors';

@Injectable({ providedIn: 'root' })
export class TagFacade {
  private readonly store$ = inject(Store);
  tags$ = this.store$.select(selectTags);

  fetchTags(query?: string): void {
    this.store$.dispatch(TagActions.fetchTags({ query }));
  }
}
