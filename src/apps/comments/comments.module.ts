import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comments } from './entity/comments.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comments]), UsersModule],
    controllers: [ CommentsController],
    providers: [CommentsService, JwtAuthGuard]
})
export class CommentsModule {}
