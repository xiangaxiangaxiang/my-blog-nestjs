import { IsNotEmpty, Length} from "class-validator"

export class UserRegisterDto {

    @Length(2, 32)
    readonly nickname:string

    @IsNotEmpty()
    readonly password:string

    @Length(2, 32)
    readonly account:string

}