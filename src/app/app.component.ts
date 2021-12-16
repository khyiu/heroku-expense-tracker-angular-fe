import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'het-root',
  template: `
    <div fxLayout="column" fxFlexFill>
      <div fxFlex="100" fxLayout="row">
        <het-navigation-menu></het-navigation-menu>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {
  constructor(private readonly translateService: TranslateService) {
    translateService.use('fr');
  }
}
