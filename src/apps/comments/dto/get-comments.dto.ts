import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetCommentsDto {

    @IsNumberString()
    readonly offset: number

    @IsNumberString()
    readonly limit: number

    @IsString()
    targetId: string

    @IsOptional()
    @IsString()
    searchText: string

}