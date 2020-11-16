import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entity/articles.entity';
import { ReleaseStatus } from '../articles/entity/enum';
import { Comments } from '../comments/entity/comments.entity';
import { IsDelete } from '../comments/entity/enum';
import { PostStatus } from '../post/entity/enum';
import { Posts } from '../post/entity/post.entity';
import { LikeDto } from './dto/like.dto';
import { LikeType } from './entity/enum';
import { Likes } from './entity/likes.entity'

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(Likes) private readonly likesRepository: Repository<Likes>,
        @InjectRepository(Posts) private readonly postsRepository: Repository<Posts>,
        @InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>,
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
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

    private async getLike(where: {uid:string, targetId:string, type:LikeType}) {
        const like = await this.likesRepository.find({
            where
        })
        return like
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
    }

    private async getData(type:LikeType, targetId:string) {
        let data
        if (type === LikeType.ARTICLE) {
            data = await this.articleRepository.find({
                where: {
                    articleId: targetId,
                    releaseStatus: ReleaseStatus.RELEASE
                }
            })
        } else if (type === LikeType.COMMENT) {
            data = await this.commentsRepository.find({
                where: {
                    uniqueId: targetId,
                    isDeleted: IsDelete.NO
                }
            })
        } else if (type === LikeType.POST) {
            data = await this.postsRepository.find({
                where: {
                    postId: targetId,
                    status: PostStatus.POST
                }
            })
        }
        if (!data) {
            throw new HttpException({message: '对象已被删除'}, HttpStatus.BAD_REQUEST)
        }
        return data
    }

}
