import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TagsService } from '../../generated-sources/expense-api';
import * as TagActions from './tag.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class TagEffects {
  fetchTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.fetchTags),
      switchMap((action: ReturnType<typeof TagActions.fetchTags>) =>
        this.tagsService.getTags(action.query).pipe(
          map((tags) => TagActions.tagsFetched({ tags })),
          catchError(() => of(TagActions.tagError()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly tagsService: TagsService
  ) {}
}
