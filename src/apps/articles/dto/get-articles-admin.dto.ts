import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/utils/pagination.dto";
import { ArticleType } from "../entity/enum";

export class GetArticlesAdminDto extends PaginationDto {

    @IsOptional()
    @IsString()
    label:string

    @IsOptional()
    @IsEnum(ArticleType)
    articleType: number

}