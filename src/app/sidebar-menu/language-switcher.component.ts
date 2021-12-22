import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type AppLanguage = 'EN' | 'FR' | 'NL';

@Component({
  selector: 'het-language-switcher',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  readonly supportedLanguages: AppLanguage[] = ['EN', 'FR', 'NL'];
  readonly localStorageKey = 'EXPENSE_TRACKER_APP_LANGUAGE' as const;

  selectedLanguage: AppLanguage = 'EN';

  constructor(private readonly translateService: TranslateService) {}

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
