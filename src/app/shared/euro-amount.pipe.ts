import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroAmount',
  pure: true,
})
export class EuroAmountPipe implements PipeTransform {
  transform(value: number | null): string | null {
    if (value === null || value === undefined) {
      return null;
    } else {
      const stringRepresentation = value.toString(10);
      const stringTokens = stringRepresentation.split('.');
      let result = `${value > 0 ? '+' : ''}${stringTokens[0]}`;

      if (stringTokens[1]) {
        result += `.${stringTokens[1].padEnd(2, '0')}`;
      }

      result += ' €';
      return result;
    }
  }
}
