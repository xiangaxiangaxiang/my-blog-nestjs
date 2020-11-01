import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

}
