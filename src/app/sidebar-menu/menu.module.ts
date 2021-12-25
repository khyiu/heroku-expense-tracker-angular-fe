import { NgModule } from '@angular/core';
import { NavigationMenuComponent } from './navigation-menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LogoffComponent } from './logoff.component';
import {RoutesMenuComponent} from './routes-menu.component';

@NgModule({
  declarations: [
    NavigationMenuComponent,
    LanguageSwitcherComponent,
    LogoffComponent,
    RoutesMenuComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    ImageModule,
    DividerModule,
    ButtonModule,
    RippleModule,
  ],
  exports: [NavigationMenuComponent],
})
export class MenuModule {}
