import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseModalFormComponent } from './expense-modal-form.component';
import { ExpenseFacade } from '../store/expense/expense.facade';

@Component({
  selector: 'het-dashboard-toolbar',
  template: `
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class DashboardToolbarComponent implements OnDestroy {
  private ref: DynamicDialogRef;

  pendingWriteRequest$ = this.expenseFacade.pendingWriteRequest$;

  @Input()
  selectedExpenseIds: string[] = [];

  constructor(
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly expenseFacade: ExpenseFacade
  ) {}

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
