import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';

interface FormFieldError {
  i18nKey: string;
  i18nArgument: unknown;
}

@Component({
  selector: 'het-form-field-error',
  standalone: true,
  template: `
    <small class="error" *ngFor="let fieldError of fieldErrors">
      {{ fieldError.i18nKey | translate: fieldError.i18nArgument }}
    </small>
  `,
  styles: [
    `
      .error {
        color: #ef9a9a;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, TranslateModule],
})
export class FormFieldErrorComponent implements OnInit {
  @Input()
  errors: ValidationErrors | null;

  fieldErrors: FormFieldError[];

  ngOnInit(): void {
    if (this.errors) {
      this.fieldErrors = Object.keys(this.errors).map(
        (key) =>
          <FormFieldError>{
            i18nKey: `Errors.${key}`,
            i18nArgument: this.errors?.[key],
          }
      );
    }
  }
}
