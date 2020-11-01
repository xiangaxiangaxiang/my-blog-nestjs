import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LikesModule } from '../likes/likes.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entity/articles.entity';
import { Labels } from './entity/labels.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Article, Labels]), LikesModule],
    controllers: [ArticlesController],
    providers: [ArticlesService, JwtStrategy]
})
export class ArticlesModule {}
