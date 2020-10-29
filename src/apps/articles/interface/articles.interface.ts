import { Article } from "../entity/articles.entity";

export interface GetArticleList {
    total:number
    articles: Article[]
}

export interface SaveImage {
    urlList: [number, string][]
}