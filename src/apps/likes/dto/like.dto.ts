import { IsEnum, IsString, IsUUID } from "class-validator";
import { TargetType } from "src/utils/common.enum";

export class LikeDto {

    @IsString()
    targetId: string

    @IsEnum(TargetType)
    type: number

    @IsUUID()
    replyUid: string

}