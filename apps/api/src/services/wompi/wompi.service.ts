import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WompiConfig } from '@/config/wompi.config';

@Injectable()
export class WompiService {
  constructor(
    private readonly http: HttpService,
    @Inject('WOMPI_MODULE_OPTIONS')
    private readonly opts: WompiConfig,
  ) {}

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  validateEventSignature(body: any, headerChecksum: string): boolean {
    const { signature, timestamp, data } = body;
    if (!signature || !signature.properties || !signature.checksum) {
      throw new UnauthorizedException('Firma inválida');
    }

    // Concatenar valores según properties
    let concat = '';
    for (const prop of signature.properties) {
      const val = this.getNestedValue(data, prop);
      concat += val;
    }
    concat += timestamp;

    // Agregar secreto
    const secret = this.opts.eventsKey;
    concat += secret;

    // Calcular SHA256
    const digest = crypto
      .createHash('sha256')
      .update(concat)
      .digest('hex')
      .toUpperCase();

    // Comparar
    return digest === signature.checksum || digest === headerChecksum;
  }

  generateSignature({
    amount,
    currency,
    reference,
  }: {
    reference: string;
    amount: number;
    currency: string;
  }): string {
    const params = [
      reference,
      amount,
      currency,
      'test_integrity_zXRgIFwKuL65l7Hl8IUmwWf0FUaVnWpb',
    ].join('');
    return crypto.createHash('sha256').update(params).digest('hex');
  }
}
