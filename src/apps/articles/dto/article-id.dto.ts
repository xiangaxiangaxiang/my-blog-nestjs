import { IsString } from "class-validator";

export class ArticleId {

    @IsString()
    articleId: string

}