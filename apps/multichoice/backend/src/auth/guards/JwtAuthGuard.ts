import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // bỏ qua buoc check token
    // if (err || !user) {
    //   throw err || new UnauthorizedException();
    // }
    return user;
  }
}
