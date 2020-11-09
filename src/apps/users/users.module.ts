import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import {JwtModule} from "@nestjs/jwt";
import { User } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from '../../auth/jwt.strategy'
import config from 'src/config/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
        secret: config.jwtSecret,
        signOptions: {
            expiresIn: config.jwtexpiresIn
        }
    })],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy]
})
export class UsersModule {}
