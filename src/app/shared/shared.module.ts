import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EuroAmountPipe } from './euro-amount.pipe';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';
import { RequiredIndicatorPipe } from './required-indicator.pipe';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    EuroAmountPipe,
    FormFieldErrorComponent,
    RequiredIndicatorPipe,
  ],
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
    FormFieldErrorComponent,
    RequiredIndicatorPipe,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
})
export class SharedModule {}
