import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [FlexLayoutModule, CommonModule],
  exports: [FlexLayoutModule, CommonModule, TranslateModule],
})
export class SharedModule {}
