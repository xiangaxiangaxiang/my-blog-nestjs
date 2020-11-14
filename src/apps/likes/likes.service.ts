import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeDto } from './dto/like.dto';
import { LikeType } from './entity/enum';
import { Likes } from './entity/likes.entity'

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(Likes) private readonly likesRepository: Repository<Likes>
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
            throw new HttpException({message: '已经点赞过了'}, HttpStatus.BAD_REQUEST)
        }
    }

}
