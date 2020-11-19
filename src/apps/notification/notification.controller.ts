import { Controller, Get, HttpException, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { GetNotificationDto } from './dto/get-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Get('/')
    @UseGuards(new JwtAuthGuard(UserType.USER))
    async getNofitication(@Request() req, getNotificationDto:GetNotificationDto) {
        
        const uid = req.user.uid
        const data = await this.notificationService.getNotification(uid, getNotificationDto)

        throw new HttpException({data}, HttpStatus.OK)

    }

    @Get('/unread_nums')
    @UseGuards(new JwtAuthGuard(UserType.TOURIST))
    async getUnreadNums(@Request() req) {
        
        const { userType, uid } = req.user
        if (userType < UserType.USER) {
            throw new HttpException({}, HttpStatus.UNAUTHORIZED)
        }

        const data = await this.notificationService.getUnreadNums(uid)
        throw new HttpException({data}, HttpStatus.OK)

    }

}
