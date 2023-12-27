import { NgModule } from '@angular/core';
import { NavigationMenuComponent } from './navigation-menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    SharedModule,
    ImageModule,
    DividerModule,
    ButtonModule,
    RippleModule,
  ],
  exports: [],
})
export class MenuModule {}
