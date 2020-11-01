import { IsString } from "class-validator";

export class GetRecommendationDto {

    @IsString()
    labels: string

    @IsString()
    articleId: string

}