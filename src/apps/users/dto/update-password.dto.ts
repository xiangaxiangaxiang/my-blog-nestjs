import { IsUUID, Length } from "class-validator"

export class UpdatePasswordDto {

    @IsUUID()
    uid: string

    @Length(8, 20)
    oldPassword: string

    @Length(8, 20)
    newPassword: string

}