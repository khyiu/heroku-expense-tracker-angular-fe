import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NgForOf } from '@angular/common';

type AppLanguage = 'EN' | 'FR' | 'NL';

@Component({
  selector: 'het-language-switcher',
  standalone: true,
  template: `
    <div fxLayout="row" fxLayoutAlign="center">
      <div fxLayout="row" fxLayoutGap="1em">
        <button
          pButton
          pRipple
          type="button"
          class="p-button-text"
          *ngFor="let appLanguage of supportedLanguages"
          [label]="appLanguage"
          [ngClass]="{ 'selected bold': selectedLanguage === appLanguage }"
          (click)="selectLanguage(appLanguage)"
        ></button>
      </div>
    </div>
  `,
  styles: [
    `
      .p-button {
        &:focus {
          box-shadow: 0 0 0 1px white;
        }

        &.p-button-text {
          color: white;
        }

        &:active.p-button-text {
          color: white;
        }

        &:hover.p-button-text {
          color: white;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlexLayoutModule, ButtonModule, RippleModule, NgForOf],
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly translateService = inject(TranslateService);

  readonly supportedLanguages: AppLanguage[] = ['EN', 'FR', 'NL'];
  readonly localStorageKey = 'EXPENSE_TRACKER_APP_LANGUAGE' as const;

  selectedLanguage: AppLanguage = 'EN';

  ngOnInit(): void {
    this.selectedLanguage =
      (localStorage.getItem(this.localStorageKey) as AppLanguage) || 'EN';
    this.translateService.use(this.selectedLanguage);
  }

  selectLanguage(lang: AppLanguage): void {
    this.selectedLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem(this.localStorageKey, lang);
  }
}
