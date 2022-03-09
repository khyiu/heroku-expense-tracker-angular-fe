import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroAmount',
  pure: true,
})
export class EuroAmountPipe implements PipeTransform {
  transform(value: number | null, numberOfDecimals = 2): string | null {
    if (value === null || value === undefined) {
      return null;
    } else {
      const stringRepresentation = value.toFixed(numberOfDecimals);
      const stringTokens = stringRepresentation.split('.');
      return `${value > 0 ? '+' : ''}${stringTokens[0]}.${stringTokens[1]} €`;
    }
  }
}
