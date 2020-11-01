import { IsEnum } from "class-validator"
import { ArticleType } from "../entity/enum"

export class GetLabelsDto {

    @IsEnum(ArticleType)
    type: number

}