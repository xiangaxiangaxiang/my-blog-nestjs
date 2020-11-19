import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Article } from '../articles/entity/articles.entity';
import { Comments } from '../comments/entity/comments.entity';
import { NotificationModule } from '../notification/notification.module';
import { Posts } from '../post/entity/post.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { Likes } from './entity/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Likes, Posts, Article, Comments]), StatisticsModule, NotificationModule],
    exports: [LikesService],
    controllers: [LikesController],
    providers: [LikesService, JwtStrategy]
})
export class LikesModule {}
