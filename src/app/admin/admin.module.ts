import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [AdminRoutingModule, FileUploadModule, SharedModule],
})
export class AdminModule {}
