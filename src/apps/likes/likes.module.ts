import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Likes } from './entity/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Likes])],
    exports: [LikesService],
    controllers: [LikesController],
    providers: [LikesService, JwtStrategy]
})
export class LikesModule {}
