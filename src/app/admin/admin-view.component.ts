import { Component } from '@angular/core';
import { ExpenseFacade } from '../store/expense/expense.facade';
import {FileUpload, FileUploadModule} from 'primeng/fileupload';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'het-admin.view',
  standalone: true,
  template: `
    <div id="container" fxFlex="100">
      <h2>{{ 'Actions' | translate }}</h2>
      <div fxLayout="column" fxLayoutGap="1rem">
        <div fxLayout="row" fxLayoutGap="1rem">
          <p-fileUpload
            #fileUploader
            accept=".csv"
            mode="basic"
            chooseLabel="{{ 'ImportFile' | translate }}"
            chooseIcon="pi-upload"
            [maxFileSize]="512000"
            [auto]="true"
            [customUpload]="true"
            [fileLimit]="1"
            (uploadHandler)="uploadFile($event, fileUploader)"
            [disabled]="pendingImportRequest$ | async"
          ></p-fileUpload>
          <p-button
            label="{{ 'Export' | translate }}"
            icon="pi pi-download"
            (click)="exportExpenses()"
            [loading]="pendingExportRequest$ | async"
          ></p-button>
        </div>
        <p-progressBar
          mode="indeterminate"
          [style]="{ height: '6px' }"
          *ngIf="pendingImportRequest$ | async"
        ></p-progressBar>
      </div>
    </div>
  `,
  styles: [
    `
      #container {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    `,
  ],
  imports: [FlexLayoutModule, TranslateModule, FileUploadModule, AsyncPipe],
})
export class AdminViewComponent {
  pendingImportRequest$ = this.expenseFacade.pendingImportRequest$;
  pendingExportRequest$ = this.expenseFacade.pendingExportRequest$;

  constructor(private readonly expenseFacade: ExpenseFacade) {}

  uploadFile($event: { files: File[] }, fileUploader: FileUpload): void {
    this.expenseFacade.importExpenses($event.files[0]);
    fileUploader.clear();
  }

  exportExpenses(): void {
    this.expenseFacade.exportExpenses();
  }
}
