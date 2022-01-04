import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { BASE_PATH } from '../../generated-sources/expense-api';
import { StoreModule } from '@ngrx/store';
import { Features } from '../stores';
import { EffectsModule } from '@ngrx/effects';
import { BalanceEffects } from './balance.effects';
import { BalanceFacade } from './balance.facade';
import { balanceReducer } from './balance.reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(Features.BALANCE, balanceReducer),
    EffectsModule.forFeature([BalanceEffects]),
  ],
  providers: [BalanceFacade],
})
export class BalanceNgRxModule {
  constructor(@Optional() @SkipSelf() selfModule?: BalanceNgRxModule) {
    if (selfModule) {
      throw new Error(
        'BalanceNgRxModule is already loaded. Import it once only!'
      );
    }
  }

  static forRoot(basePath: string): ModuleWithProviders<BalanceNgRxModule> {
    return {
      ngModule: BalanceNgRxModule,
      providers: [{ provide: BASE_PATH, useValue: basePath }],
    };
  }
}
