import { NgModule } from '@angular/core';
import { AdminViewComponent } from './admin-view.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AdminViewComponent],
  imports: [AdminRoutingModule, FileUploadModule, SharedModule],
})
export class AdminModule {}
