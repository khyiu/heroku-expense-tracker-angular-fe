import {NgModule} from "@angular/core";
import {NavigationMenuComponent} from "./navigation-menu.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ImageModule} from "primeng/image";
import {DividerModule} from "primeng/divider";

@NgModule({
  declarations: [NavigationMenuComponent],
  imports: [
    RouterModule, SharedModule, ImageModule, DividerModule
  ],
  exports: [NavigationMenuComponent]
})
export class MenuModule {

}
