import { IsEnum, IsString, IsUUID } from "class-validator";
import { LikeType } from "../entity/enum";

export class LikeDto {

    @IsString()
    targetId: string

    @IsEnum(LikeType)
    type: number

    @IsUUID()
    replyUid: string

}