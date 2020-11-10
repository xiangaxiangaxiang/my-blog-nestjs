import { Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('comments')
export class CommentsController {

    constructor(
        private readonly commentsService:CommentsService
    ) {}

    @Post('add')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async addComments(@Request() req, addCommentDto: AddCommentDto) {
        const uid = req.user.uid

        const data = await this.commentsService.addComment(uid, addCommentDto)
        throw new HttpException({
            message: '评论成功！！！',
            data
        }, HttpStatus.OK)
    }

}
