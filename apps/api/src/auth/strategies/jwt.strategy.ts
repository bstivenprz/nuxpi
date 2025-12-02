import { SupabaseConfig } from '@/config/supabase.config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionType, SupabaseJwtClaims } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: SupabaseConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.fromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        jwksUri: config.jwks_url,
      }),
      ignoreExpiration: false,
    });
  }

  async validate(payload: SupabaseJwtClaims): Promise<SessionType> {
    return {
      sub: payload.sub,
      username: payload.user_metadata.username,
      account_id: payload.user_metadata.account_id,
      profile_id: payload.user_metadata.profile_id,
    };
  }

  private static fromCookies(req: Request): string | null {
    if (!req.cookies) return null;

    // Se requiere este algoritmo para obtener el JWT de las cookies.
    // https://github.com/supabase/ssr/blob/main/docs/design.md#encoding-cookie-values

    function extract(obj: Record<string, string>, key: string) {
      if (obj[key]) return obj[key];

      const chunks = [];
      let index = 0;
      while (obj[`${key}.${index}`] !== undefined) {
        chunks.push(obj[`${key}.${index}`]);
        index++;
      }
      if (chunks.length > 0) return chunks.join('');
      return null;
    }

    function decode(encoded: string) {
      let base64_encoded = encoded;
      base64_encoded = base64_encoded
        .replace('base64-', '')
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      while (base64_encoded.length % 4 !== 0) {
        base64_encoded += '=';
      }

      return Buffer.from(base64_encoded, 'base64').toString('utf8');
    }

    const encoded_cookie = extract(
      req.cookies,
      process.env.SUPABASE_COOKIE_NAME,
    );
    if (!encoded_cookie) return null;

    try {
      return (JSON.parse(decode(encoded_cookie)) as { access_token: string })
        .access_token;
    } catch {
      return null;
    }
  }
}
