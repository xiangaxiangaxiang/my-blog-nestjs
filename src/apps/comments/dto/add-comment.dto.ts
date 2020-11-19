import { IsEnum, IsOptional, Length } from "class-validator";
import { TargetType } from "src/utils/common.enum";

export class AddCommentDto {

    @Length(1, 50)
    targetId: string

    @Length(1, 500)
    content: string

    @IsEnum(TargetType)
    type: number

    @IsOptional()
    @Length(1, 50)
    commentId: string

    @IsOptional()
    @Length(1, 50)
    replyUid: string

}