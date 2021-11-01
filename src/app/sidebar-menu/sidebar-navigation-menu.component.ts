import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'het-sidebar-navigation-menu',
  styles: [`
    .p-sidebar {
      width: 250px;
    }
  `],
  template: `
    <div class="p-sidebar">
      <i class="pi pi-list"></i>
      <i class="pi pi-plus-circle"></i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigationMenuComponent {

}
