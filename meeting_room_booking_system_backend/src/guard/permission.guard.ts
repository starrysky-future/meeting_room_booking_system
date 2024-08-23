import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }

    const requirePermissions = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );

    if (!requirePermissions) {
      return true;
    }

    const permissions = request.user.permissions;

    for (let i = 0; i < requirePermissions.length; i++) {
      const curPermission = requirePermissions[i];
      const found = permissions.find((item) => item.code === curPermission);

      if (!found) {
        throw new UnauthorizedException('您没有权限访问该接口');
      }
    }

    return true;
  }
}
