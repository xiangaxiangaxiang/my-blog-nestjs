import { Length } from 'class-validator'


export class UpdateNicknameDto {

    @Length(2, 32)
    readonly nickname:string

}