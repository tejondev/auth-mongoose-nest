import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SameUserChangesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Extract the user info from the request object
    const { user, params } = context.switchToHttp().getRequest();

    if (user.userId !== params.id)
      throw new UnauthorizedException("You can't change other user's data");

    return true;
  }
}
