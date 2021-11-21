import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [FlexLayoutModule, CommonModule],
  exports: [FlexLayoutModule, CommonModule],
})
export class SharedModule {}
