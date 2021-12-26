import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EuroAmountPipe } from './euro-amount.pipe';

@NgModule({
  declarations: [EuroAmountPipe],
  imports: [FlexLayoutModule, CommonModule],
  exports: [FlexLayoutModule, CommonModule, TranslateModule, EuroAmountPipe],
})
export class SharedModule {}
