import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseModalFormComponent } from './expense-modal-form.component';

@Component({
  selector: 'het-dashboard-toolbar',
  template: `
    <div fxLayout="row">
      <button
        pButton
        pRipple
        type="button"
        label="{{ 'AddExpense' | translate }}"
        class="p-button-outlined"
        icon="pi pi-plus"
        (click)="openNewExpenseForm()"
      ></button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class DashboardToolbarComponent implements OnDestroy {
  private ref: DynamicDialogRef;

  constructor(
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.ref?.close();
  }

  openNewExpenseForm(): void {
    this.ref = this.dialogService.open(ExpenseModalFormComponent, {
      header: this.translateService.instant('NewExpense'),
      width: '90%',
      height: '90%',
      // contentStyle: { 'max-height': '500px', overflow: 'auto' },
      // baseZIndex: 10000,
    });

    /*    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        this.messageService.add({
          severity: 'info',
          summary: 'Product Selected',
          detail: product.name,
        });
      }
    });*/
  }
}
