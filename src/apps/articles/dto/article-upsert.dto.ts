import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { ArticleType, ReleaseStatus } from "../entity/enum";

export class UpsertArticleDto {

    @Length(2,32)
    title: string

    @IsEnum(ArticleType)
    articleType: number

    @IsString()
    labels: string

    @Length(1)
    content: string
    
    @Length(1)
    html: string
    
    @Length(1)
    markdown: string
    
    @IsOptional()
    @IsString()
    articleId: string

    @IsOptional()
    @IsEnum(ReleaseStatus)
    release: number

    @IsOptional()
    @IsString()
    firstImage: string

}