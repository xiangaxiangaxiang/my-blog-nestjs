import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comments } from './entity/comments.entity';
import { IsDelete } from './entity/enum';
import { myXss } from 'src/utils/xss';
import { UsersService } from '../users/users.service';
import { AddComment } from './interface/comments.interface';
import { CommentIdDto } from './dto/comment-id.dto';
import { UserType } from '../users/entity/enum';
import { GetCommentsDto } from './dto/get-comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private readonly commentRepository: Repository<Comments>,
        private readonly usersService:UsersService
    ) {}

    async addComment(uid:string, addCommentDto: AddCommentDto):Promise<AddComment> {

        if (addCommentDto.replyUid) {
            const commentExists = await this._findComment({commentId: addCommentDto.commentId})
            if (!commentExists || commentExists.isDeleted === IsDelete.YES) {
                throw new HttpException({message: '评论不存在或已删除'}, HttpStatus.BAD_REQUEST)
            }
        }
        const comment = this.commentRepository.create({
            uid,
            commentId: addCommentDto.commentId || this._generateCommentId(),
            targetId: addCommentDto.targetId,
            content: myXss(addCommentDto.content),
            replyUid: addCommentDto.replyUid || null
        })
        this.commentRepository.save(comment)

        const uidList = [uid]
        if (addCommentDto.replyUid) {
            uidList.push(addCommentDto.replyUid)
        }
        const users = await this.usersService.getUsers(uidList)

        return {
            comment: {
                uniqueId: comment.uniqueId,
                commentId: comment.commentId,
                targetId: comment.targetId,
                content: comment.content,
                likeNums: comment.likeNums,
                createdTime: comment.createdTime,
                isDeleted: comment.isDeleted,
                likeStatus: false,
                userInfo: users.get(uid),
                replyUserInfo: users.get(addCommentDto.replyUid) || {},
                replyComments: !addCommentDto.replyUid ? [] : null
            }
        }
 
    }

    async deleteComment(uid: string, userType: UserType, commentIdDto: CommentIdDto) {
        const comment = await this._findComment({uniqueId: commentIdDto.uniqueId})
        if (!comment || comment.isDeleted === IsDelete.YES) {
            throw new HttpException({message: '该评论已删除'}, HttpStatus.BAD_REQUEST)
        }
        if (comment.uid !== uid && userType !== UserType.ADMIN) {
            throw new HttpException({message: '你不能删除该评论。'}, HttpStatus.BAD_REQUEST)
        }
        await this.commentRepository.delete({uniqueId: commentIdDto.uniqueId})
    }

    async getComments(getCommentsDto:GetCommentsDto) {
        const [commentIds, total] = await this.commentRepository.createQueryBuilder('comment')
            .select('comment.commentId')
            .where('comment.target_id=:targetId', {targetId: getCommentsDto.targetId})
            .groupBy('comment.comment_id')
            .offset(getCommentsDto.offset)
            .limit(getCommentsDto.limit)
            .getManyAndCount()
        const comments = await this.commentRepository.find({
            select: ['commentId', 'uniqueId', 'createdTime', 'likeNums', 'uid', 'replyUid', 'content'],
            where: commentIds
        })
        const uidList = []
        comments.forEach(comment => {
            uidList.push(comment.uid)
            if (comment.replyUid) {
                uidList.push(comment.replyUid)
            }
        })
        const users = await this.usersService.getUsers([...new Set(uidList)])
        const newComments = []
        const map = new Map()
        comments.forEach(comment => {
            if (map.has(comment.commentId)) {
                const i = map.get(comment.commentId)
                newComments[i].replyComments.push(Object.assign({}, comment, {
                    userInfo: users.get(comment.uid),
                    replyUserInfo: users.get(comment.replyUid) || {}
                }))
            } else {
                map.set(comment.commentId, newComments.length)
                newComments.push(Object.assign({}, comment, {
                    userInfo: users.get(comment.uid),
                    replyUserInfo: users.get(comment.replyUid) || {},
                    replyComments: []
                }))
            }
        })
        return {
            comments: newComments,
            total
        }
    }

    private _generateCommentId() {
        const num = Date.now() * 1534
        return num.toString(16)
    }

    private async _findComment(where: {commentId?:string, uniqueId?:string}) {
        const comment = await this.commentRepository.findOne({
            where
        })
        return comment
    }

}
