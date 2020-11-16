import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './apps/users/users.module';
import { ArticlesModule } from './apps/articles/articles.module';
import { StatisticsModule } from './apps/statistics/statistics.module';
import { CommentsModule } from './apps/comments/comments.module';
import { LikesModule } from './apps/likes/likes.module';
import { NotificationModule } from './apps/notification/notification.module';
import { PostModule } from './apps/post/post.module';

@Module({
    imports: [TypeOrmModule.forRoot(), UsersModule, ArticlesModule, StatisticsModule, CommentsModule, LikesModule, NotificationModule, PostModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
