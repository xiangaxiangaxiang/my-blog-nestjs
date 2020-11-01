import { Article } from "../entity/articles.entity";
import { Labels } from "../entity/labels.entity";

export interface GetArticleList {
    total?:number
    articles: Article[]
}

export interface SaveImage {
    urlList: [number, string][]
}

export interface GetArticleDetail {
    article: Article
}

export interface GetLabels {
    labels: Labels[]
}