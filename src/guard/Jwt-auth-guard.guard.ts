import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/apps/users/entity/enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private userType: UserType) {
        super()
    }

    canActivate(context: ExecutionContext) {
        // 在这里添加自定义的认证逻辑
        // 例如调用 super.logIn(request) 来建立一个session
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // 可以抛出一个基于info或者err参数的异常
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        if (user.userType < this.userType) {
            const message = this.userType === 300 ? '无此权限' : '请登陆后再操作'
            throw new HttpException({message}, HttpStatus.UNAUTHORIZED)
        }
        return user;
    }
}