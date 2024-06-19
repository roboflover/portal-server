import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface ParseArrayOptions {
  items: any;
  separator?: string;
}

@Injectable()
export class ParseArrayPipe implements PipeTransform {
  constructor(private readonly options: ParseArrayOptions) {}

  transform(value: any): any {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed (string is expected)');
    }

    const values = value.split(this.options.separator || ',');
    return values.map((val) => {
      if (this.options.items === String) {
        return val;
      }
      throw new BadRequestException('Validation failed (unsupported type)');
    });
  }
}
