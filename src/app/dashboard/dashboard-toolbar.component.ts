import {
  ChangeDetectionStrategy,
  Component, inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExpenseModalFormComponent } from './expense-modal-form.component';
import { ExpenseFacade } from '../store/expense/expense.facade';
import { DATE_FORMAT } from '../shared/shared.constants';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'het-dashboard-toolbar',
  standalone: true,
  template: `
    <div fxLayout="column" fxLayoutGap="0.5rem">
      <div fxLayout="row" fxLayoutGap="1rem">
        <button
          pButton
          pRipple
          type="button"
          label="{{ 'AddExpense' | translate }}"
          class="p-button-outlined"
          icon="pi pi-plus"
          (click)="openNewExpenseForm()"
        ></button>
        <button
          pButton
          pRipple
          type="button"
          label="{{ 'MarkAsChecked' | translate }}"
          class="p-button-outlined"
          icon="pi pi-check-circle"
          (click)="updateSelectedExpensesStatus(true)"
          [disabled]="!selectedExpenseIds?.length"
          [loading]="pendingWriteRequest$ | async"
        ></button>
        <button
          pButton
          pRipple
          type="button"
          label="{{ 'MarkAsUnchecked' | translate }}"
          class="p-button-outlined"
          icon="pi pi-ban"
          (click)="updateSelectedExpensesStatus(false)"
          [disabled]="!selectedExpenseIds?.length"
          [loading]="pendingWriteRequest$ | async"
        ></button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    FlexLayoutModule,
    ButtonModule,
    RippleModule,
    TranslateModule,
    AsyncPipe,
  ],
})
export class DashboardToolbarComponent implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly expenseFacade = inject(ExpenseFacade);

  private ref: DynamicDialogRef;
  readonly dateFormat = DATE_FORMAT;

  pendingWriteRequest$ = this.expenseFacade.pendingWriteRequest$;

  @Input()
  selectedExpenseIds: string[] = [];

  ngOnDestroy(): void {
    this.ref?.close();
  }

  openNewExpenseForm(): void {
    this.ref = this.dialogService.open(ExpenseModalFormComponent, {
      header: this.translateService.instant('NewExpense'),
      width: '40%',
    });
  }

  updateSelectedExpensesStatus(checked: boolean): void {
    this.expenseFacade.updateExpensesStatus(checked, this.selectedExpenseIds);
  }
}
