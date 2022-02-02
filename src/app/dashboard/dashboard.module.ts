import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';
import { TagModule } from 'primeng/tag';
import { environment } from '../../environments/environment';
import { BalanceNgRxModule } from '../store/balance/balance.module';
import { RippleModule } from 'primeng/ripple';
import { DashboardToolbarComponent } from './dashboard-toolbar.component';
import { ExpenseModalFormComponent } from './expense-modal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardToolbarComponent,
    ExpenseModalFormComponent,
  ],
  imports: [
    DashboardRoutingModule,
    TableModule,
    ButtonModule,
    SharedModule,
    TagModule,
    BalanceNgRxModule.forRoot(environment.apiBasePath),
    RippleModule,
    ReactiveFormsModule,
    CalendarModule,
    InputNumberModule,
    AutoCompleteModule,
    InputTextareaModule,
  ],
})
export class DashboardModule {}
