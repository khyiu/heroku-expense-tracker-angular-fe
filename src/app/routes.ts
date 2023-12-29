import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminViewComponent } from './admin/admin-view.component';
import { ExpenseFacade } from './store/expense/expense.facade';
import { BalanceFacade } from './store/balance/balance.facade';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { Features } from './store/stores';
import { balanceReducer } from './store/balance/balance.reducers';
import { EffectsModule } from '@ngrx/effects';
import { BalanceEffects } from './store/balance/balance.effects';
import { tagReducer } from './store/tag/tag.reducers';
import { TagEffects } from './store/tag/tag.effects';
import { TagFacade } from './store/tag/tag.facade';

const PATHS = {
  DASHBOARD: 'dashboard',
  ADMIN: 'admin',
};

export const DASHBOARD_PARAMS = {
  PAGE_SIZE: 'pageSize',
  PAGE_NUMBER: 'pageNumber',
  SORT_BY: 'sortBy',
  SORT_DIRECTION: 'sortDir',
};

export const ROUTES: Routes = [
  {
    path: PATHS.DASHBOARD,
    pathMatch: 'full',
    component: DashboardComponent,
    providers: [
      BalanceFacade,
      importProvidersFrom(
        StoreModule.forFeature(Features.BALANCE, balanceReducer),
        EffectsModule.forFeature([BalanceEffects]),
        BalanceFacade,
        StoreModule.forFeature(Features.TAG, tagReducer),
        EffectsModule.forFeature([TagEffects]),
        TagFacade
      ),
    ],
  },
  { path: PATHS.ADMIN, pathMatch: 'full', component: AdminViewComponent },
  { path: '**', redirectTo: PATHS.DASHBOARD },
];
