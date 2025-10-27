import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(param: string) {
    if (param == null || param == '')
      return '-';
    else
      return moment(param, 'YYYYMMDDhhmmss').format('DD-MM-YYYY');
  }

}
