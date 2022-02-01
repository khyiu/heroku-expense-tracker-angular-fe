import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EuroAmountPipe } from './euro-amount.pipe';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';
import { RequiredIndicatorPipe } from './required-indicator.pipe';

@NgModule({
  declarations: [
    EuroAmountPipe,
    FormFieldErrorComponent,
    RequiredIndicatorPipe,
  ],
  imports: [FlexLayoutModule, CommonModule, TranslateModule],
  exports: [
    FlexLayoutModule,
    CommonModule,
    TranslateModule,
    EuroAmountPipe,
    FormFieldErrorComponent,
    RequiredIndicatorPipe,
  ],
})
export class SharedModule {}
