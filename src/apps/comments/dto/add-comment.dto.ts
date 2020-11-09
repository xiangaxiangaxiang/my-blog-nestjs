import { IsEnum, IsOptional, Length } from "class-validator";
import { NotificationType } from "src/apps/notification/entity/enum";

export class AddCommentDto {

    @Length(1, 50)
    targetId: string

    @Length(1, 500)
    content: string

    @IsEnum(NotificationType)
    type: number

    @IsOptional()
    @Length(1, 50)
    commentId: string

    @IsOptional()
    @Length(1, 50)
    replyUid: string

}