import { Length } from "class-validator"

export class UserRegisterDto {

    @Length(2, 32)
    readonly nickname:string

    @Length(8, 20)
    readonly password:string

    @Length(2, 32)
    readonly account:string

}