import { IsUUID } from "class-validator";

export class UserIdDto {

    @IsUUID()
    uid: string

}