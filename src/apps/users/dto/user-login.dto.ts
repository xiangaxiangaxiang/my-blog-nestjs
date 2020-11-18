import { IsNotEmpty, Length} from "class-validator"

export class UserLoginDto {

    @IsNotEmpty()
    readonly password:string

    @Length(2, 32)
    readonly account:string

}