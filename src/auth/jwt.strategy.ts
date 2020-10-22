import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from 'src/config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: req => {
                const token = new RegExp(`(?:^|\s)jwt=([^;]*)`).exec(req.headers.cookie)
                return token && token[1]
            },
            ignoreExpiration: false,
            secretOrKey: config.jwtSecret,
        })
    }

    async validate(payload: any) {
        return {
            uid: payload.uid,
            userType: payload.userType,
            account: payload.account,
            hi: 666
        }
    }
}