import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private readonly locale;

  constructor() {
    this.locale = inject(LOCALE_ID);
  }

  toISOString(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', this.locale);
  }
}
