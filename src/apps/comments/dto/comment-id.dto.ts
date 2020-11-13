import { IsUUID } from "class-validator";

export class CommentIdDto {

    @IsUUID()
    uniqueId: string

}