import { IsEnum, IsNumberString, IsOptional, Max, MaxLength } from 'class-validator'

enum OrderName {
    ASC="ASC",
    DESC="DESC"
}

export class PaginationDto {

    @IsNumberString()
    readonly offset: number

    @IsNumberString()
    readonly limit: number

    @IsOptional()
    @MaxLength(10)
    readonly searchText: string

    @IsOptional()
    readonly sortName: string = 'id'

    @IsOptional()
    @IsEnum(OrderName)
    readonly orderName: OrderName = OrderName.ASC

}