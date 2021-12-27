import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';
import {TagModule} from 'primeng/tag';
import {PanelModule} from 'primeng/panel';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    DashboardRoutingModule,
    TableModule,
    ButtonModule,
    SharedModule,
    TagModule,
    PanelModule,
  ],
})
export class DashboardModule {}
