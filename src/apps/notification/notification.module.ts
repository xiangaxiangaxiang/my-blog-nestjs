import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';
import { Notification } from './entity/nofitication.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), UsersModule, CommentsModule],
    exports: [NotificationService],
    controllers: [NotificationController],
    providers: [NotificationService, JwtStrategy]
})
export class NotificationModule {}
