import { IsEnum, IsNumberString } from "class-validator";
import { NotificationType } from "../entity/enum";

export class GetNotificationDto {

    @IsNumberString()
    offset: number

    @IsNumberString()
    limit: number

    @IsEnum(NotificationType)
    type: number

}