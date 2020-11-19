import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetType } from 'src/utils/common.enum';
import { getManager, Repository } from 'typeorm';
import { Article } from '../articles/entity/articles.entity';
import { ReleaseStatus } from '../articles/entity/enum';
import { Comments } from '../comments/entity/comments.entity';
import { IsDelete } from '../comments/entity/enum';
import { NotificationType } from '../notification/entity/enum';
import { NotificationService } from '../notification/notification.service';
import { PostStatus } from '../post/entity/enum';
import { Posts } from '../post/entity/post.entity';
import { StatisticsService } from '../statistics/statistics.service';
import { LikeDto } from './dto/like.dto';
import { Likes } from './entity/likes.entity'

@Injectable()
export class LikesService {
    
    constructor(
        @InjectRepository(Likes) private readonly likesRepository: Repository<Likes>,
        @InjectRepository(Posts) private readonly postsRepository: Repository<Posts>,
        @InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>,
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        private readonly notificationService: NotificationService,
        private readonly statisticsService: StatisticsService
    ){}

    async getLikeStatus(uid: string, targetId:string):Promise<boolean> {
        const like = await this.likesRepository.findOne({
            where: {
                uid,
                targetId
            }
        })
        return like ? true: false
    }

    private async getLike(where: {uid:string, targetId:string, type:TargetType}) {
        const like = await this.likesRepository.findOne({
            where
        })
        return like
    }

    async dislike(uid: string, likeDto: LikeDto) {
        const like = await this.getLike({uid, targetId: likeDto.targetId, type: likeDto.type})
        if (!like) {
            throw new HttpException({message: '已取消点赞'}, HttpStatus.BAD_REQUEST)
        }
        await getManager().transaction(async transactionalEntityManager => {
            await this.likesRepository.delete({id: like.id})
            await this.statisticsService.minusLike(like.createdTime)
            await this.changeLikeNums(likeDto.type, likeDto.targetId, 'decrement')
            await this.notificationService.cancelNotification(uid, likeDto.replyUid, likeDto.targetId, likeDto.type, NotificationType.LIKE)
        })
    }

    async like(uid:string, likeDto:LikeDto) {
        const like = await this.getLike({
            uid,
            targetId: likeDto.targetId,
            type: likeDto.type
        })
        if (like) {
            throw new HttpException({message: '你已经点赞过了'}, HttpStatus.BAD_REQUEST)
        }
        await getManager().transaction(async transactionalEntityManager => {
            const newLike = this.likesRepository.create({
                uid,
                type: likeDto.type,
                targetId: likeDto.targetId
            })
            await transactionalEntityManager.save(newLike)
            await this.changeLikeNums(likeDto.type, likeDto.targetId, 'increment')
            await this.statisticsService.addLikes()
            await this.notificationService.addNotification(uid, likeDto.replyUid, likeDto.targetId, likeDto.type, NotificationType.LIKE)
        })
    }

    private async changeLikeNums(type:TargetType, targetId:string, operation: 'increment' | 'decrement') {
        if (type === TargetType.ARTICLE) {
            const func = this.articleRepository[operation]
            await func({
                articleId: targetId,
                releaseStatus: ReleaseStatus.RELEASE
            }, 'likeNums', 1)
        } else if (type === TargetType.COMMENT) {
            const func = this.commentsRepository[operation]
            await func({
                uniqueId: targetId,
                isDeleted: IsDelete.NO
            }, 'likeNums', 1)
        } else if (type === TargetType.POST) {
            const func = this.postsRepository[operation]
            await func({
                postId: targetId,
                status: PostStatus.POST
            }, 'likeNums', 1)
        } else {
            throw new HttpException({message: '对象不存在'}, HttpStatus.BAD_REQUEST)
        }
    }

}
