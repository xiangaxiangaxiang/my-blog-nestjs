import { Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { LikeDto } from './dto/like.dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {

    constructor(
        private readonly likesService:LikesService
    ) {}

    @Post('/')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async like(@Request() req, likeDto:LikeDto) {
        
        const uid = req.user.uid
        await this.likesService.like(uid, likeDto)
        throw new HttpException({message:'点赞成功'}, HttpStatus.OK)

    }

    @Post('/cancel')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async dislike(@Request() req, likeDto:LikeDto) {
        
        const uid = req.user.uid
        await this.likesService.dislike(uid, likeDto)
        throw new HttpException({message:'取消点赞'}, HttpStatus.OK)

    }

}
