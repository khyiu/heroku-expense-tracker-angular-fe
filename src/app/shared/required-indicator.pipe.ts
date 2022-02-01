import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'requiredIndicator',
  pure: true
})
export class RequiredIndicatorPipe implements PipeTransform {

  transform(value: string): string {
    return `${value} *`;
  }
}
