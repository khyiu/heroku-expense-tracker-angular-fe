import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';
import { TagModule } from 'primeng/tag';
import { environment } from '../../environments/environment';
import { BalanceNgRxModule } from '../store/balance/balance.module';
import { RippleModule } from 'primeng/ripple';
import { ExpenseModalFormComponent } from './expense-modal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TagNgrxModule } from '../store/tag/tag.module';
import { AccordionModule } from 'primeng/accordion';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputTextModule } from 'primeng/inputtext';
import { LetModule, PushModule } from '@ngrx/component';
import { ChipsModule } from 'primeng/chips';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    TableModule,
    ButtonModule,
    SharedModule,
    TagModule,
    BalanceNgRxModule.forRoot(environment.apiBasePath),
    TagNgrxModule.forRoot(environment.apiBasePath),
    RippleModule,
    ReactiveFormsModule,
    CalendarModule,
    InputNumberModule,
    AutoCompleteModule,
    InputTextareaModule,
    CheckboxModule,
    AccordionModule,
    TriStateCheckboxModule,
    InputTextModule,
    LetModule,
    PushModule,
    ChipsModule,
    ExpenseModalFormComponent,
  ],
  exports: [],
})
export class DashboardModule {}
