import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { Features } from '../stores';
import { EffectsModule } from '@ngrx/effects';
import { tagReducer } from './tag.reducers';
import { TagEffects } from './tag.effects';
import { TagFacade } from './tag.facade';
import { BASE_PATH } from '../../generated-sources/expense-api';

@NgModule({
  imports: [
    StoreModule.forFeature(Features.TAG, tagReducer),
    EffectsModule.forFeature([TagEffects]),
  ],
  providers: [TagFacade],
})
export class TagNgrxModule {
  constructor(@Optional() @SkipSelf() selfModule?: TagNgrxModule) {
    if (selfModule) {
      throw new Error('TagNgrxModule is already loaded. Import it once only!');
    }
  }

  static forRoot(basePath: string): ModuleWithProviders<TagNgrxModule> {
    return {
      ngModule: TagNgrxModule,
      providers: [{ provide: BASE_PATH, useValue: basePath }],
    };
  }
}
