import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetType } from 'src/utils/common.enum';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments/comments.service';
import { Notification } from '../notification/entity/nofitication.entity';
import { UsersService } from '../users/users.service';
import { GetNotificationDto } from './dto/get-notification.dto';
import { NotificationType, ReadStatus } from './entity/enum';
import { GetNotification } from './interface/notification.interface';

@Injectable()
export class NotificationService {

    constructor(
        @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
        private readonly usersService:UsersService,
        private readonly commentsService:CommentsService
    ){}

    async addNotification(operationUid:string, uid:string, targetId:string, targetType:TargetType, type:NotificationType) {
        const nofitication = this.notificationRepository.create({
            operationUid,
            uid,
            targetId,
            targetType,
            type
        })
        await this.notificationRepository.save(nofitication)
    }

    async cancelNotification(operationUid:string, uid:string, targetId:string, targetType:TargetType, type:NotificationType) {
        const nofitication = await this.notificationRepository.findOne({
            operationUid,
            uid,
            targetId,
            targetType,
            type
        })
        if (!nofitication) {
            throw new HttpException({message: '已取消通知'}, HttpStatus.BAD_REQUEST)
        }
        this.notificationRepository.delete({id: nofitication.id})
    }

    async getUnreadNums(uid: string): Promise<{ nums: number; }> {
        const nums = await this.notificationRepository.count({
            where: {
                uid,
                readStatus: ReadStatus.UNREAD
            }
        })
        return {nums}
    }

    async getNotification(uid: string, getNotificationDto: GetNotificationDto):Promise<GetNotification> {
        
        await this.notificationRepository.update({uid}, {readStatus: ReadStatus.UNREAD})
        const [notifications, total] = await this.notificationRepository.findAndCount({
            select: ['operationUid', 'uid', 'targetId', 'targetType', 'createdTime'],
            where: {
                uid,
                type: getNotificationDto.type
            },
            take: getNotificationDto.limit,
            skip: getNotificationDto.offset,
            order: {
                createdTime: 'DESC'
            }
        })
        
        const uidList = []
        const commentIds = []
        notifications.forEach(notification => {
            uidList.push(notification.uid)
            uidList.push(notification.operationUid)
            if (notification.targetType === TargetType.COMMENT) {
                commentIds.push(notification.targetId)
            }
        })
        const users = await this.usersService.getUsers(uidList)
        const comments = await this.commentsService.getCommentsMap(commentIds)
        const notices = notifications.map(notification => {
            return Object.assign({}, notification, {
                operationUserInfo: users.get(notification.operationUid) || {},
                content: comments.get(notification.targetId) || ''
            })
        })

        return {
            notices,
            total
        }
    }

}
