import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'het-dashboard',
  template: `
    <div>here comes the dashboard</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

}
