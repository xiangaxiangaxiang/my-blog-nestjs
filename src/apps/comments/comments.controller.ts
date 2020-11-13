import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, Get, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { CommentIdDto } from './dto/comment-id.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { Comments } from './entity/comments.entity';

@Controller('comments')
export class CommentsController {

    constructor(
        private readonly commentsService:CommentsService
    ) {}

    @Post('add')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async addComments(@Request() req,@Body() addCommentDto: AddCommentDto) {
        const uid = req.user.uid

        const data = await this.commentsService.addComment(uid, addCommentDto)
        throw new HttpException({
            message: '评论成功！！！',
            data
        }, HttpStatus.OK)
    }

    @Post('delete')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async deleteComment(@Request() req,@Body()  commentIdDto: CommentIdDto) {
        const uid = req.user.uid
        const userType = req.user.userType

        await this.commentsService.deleteComment(uid, userType, commentIdDto)
        throw new HttpException({ message: '删除评论成功' }, HttpStatus.OK)
    }

    @Get('/')
    async getyComments(@Query() getCommentsDto: GetCommentsDto):Promise<Comments> {

        const data = await this.commentsService.getComments(getCommentsDto)
        throw new HttpException({ data }, HttpStatus.OK)
    }

}
