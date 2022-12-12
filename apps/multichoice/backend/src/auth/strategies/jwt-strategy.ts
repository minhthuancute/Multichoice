import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import configuration from '../../config/configuration';

@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt_key,
    });
  }
  async validate(payload: AuthPayload) {
    return { username: payload.username, email: payload.email, id: payload.id };
  }
}
