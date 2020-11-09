import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comments } from './entity/comments.entity';
import { IsDelete } from './entity/enum';
import { myXss } from 'src/utils/xss';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comments) private readonly commentRepository: Repository<Comments>,
        private readonly usersService:UsersService
    ) {}

    async addComment(uid:string, addCommentDto: AddCommentDto) {

        if (addCommentDto.replyUid) {
            const commentExists = await this._findComment({commentId: addCommentDto.commentId})
            if (!commentExists || commentExists.isDeleted === IsDelete.YES) {
                throw new HttpException({message: '评论不存在或已删除'}, HttpStatus.BAD_REQUEST)
            }
        }
        const newComment = {
            uid,
            commentId: addCommentDto.commentId || this._generateCommentId(),
            targetId: addCommentDto.targetId,
            content: myXss(addCommentDto.content),
            replyUid: addCommentDto.replyUid || null
        }
        const comment = this.commentRepository.create(newComment)
        this.commentRepository.save(newComment)

        const uidList = [uid]
        if (addCommentDto.replyUid) {
            uidList.push(addCommentDto.replyUid)
        }
        const users = await this.usersService.getUsers(uidList)

        return {
            comment: {
                uniqueId: comment.uniqueId,
                commentId: newComment.commentId,
                targetId: newComment.targetId,
                content: newComment.content,
                likeNums: comment.likeNums,
                createdTime: comment.createdTime,
                isDeleted: comment.isDeleted,
                likeStatus: false,
                userInfo: users.get(uid),
                replyUserInfo: users.get(addCommentDto.replyUid) || {}
            }
        }
 
    }

    private _generateCommentId() {
        const num = Date.now() * 1534
        return num.toString(16)
    }

    private async _findComment(where: {commentId?:string}) {
        const comment = await this.commentRepository.findOne({
            where
        })
        return comment
    }

}
