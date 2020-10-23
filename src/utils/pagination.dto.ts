import { IsEnum, IsInt, IsOptional, Max, MaxLength } from 'class-validator'

enum OrderName {
    ASC="ASC",
    DESC="DESC"
}

export class PaginationDto {

    @IsInt()
    readonly offset: number

    @IsInt()
    @Max(20)
    readonly limit: number

    @IsOptional()
    @MaxLength(10)
    readonly searchText: string

    @IsOptional()
    readonly sortName: string = 'id'

    @IsOptional()
    @IsEnum(OrderName)
    readonly orderName: string = 'DESC'

}