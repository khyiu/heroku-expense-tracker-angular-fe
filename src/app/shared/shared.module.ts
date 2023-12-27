import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EuroAmountPipe } from './euro-amount.pipe';
import { RequiredIndicatorPipe } from './required-indicator.pipe';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [EuroAmountPipe, RequiredIndicatorPipe],
  imports: [
    FlexLayoutModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
  ],
  exports: [
    FlexLayoutModule,
    CommonModule,
    TranslateModule,
    EuroAmountPipe,
    RequiredIndicatorPipe,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
