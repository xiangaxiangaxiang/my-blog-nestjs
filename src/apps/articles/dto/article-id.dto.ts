import { IsString } from "class-validator";

export class ArticleIdDto {

    @IsString()
    articleId: string

}