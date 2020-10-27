import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { myXss } from 'src/utils/xss';
import { Repository } from 'typeorm';
import { UpsertArticleDto } from './dto/article-upsert.dto';
import { Article } from './entity/articles.entity';
import { ArticleType } from './entity/enum';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>
    ) {}

    async upsertArticle(upsertArticleDto: UpsertArticleDto) {
        upsertArticleDto.html = myXss(upsertArticleDto.html)
        upsertArticleDto.content = myXss(upsertArticleDto.content)
        if (!upsertArticleDto.articleId) {
            upsertArticleDto.articleId = this._getArticleId(upsertArticleDto.articleType)
            const newArticle = this.articleRepository.create(upsertArticleDto)
            this.articleRepository.save(newArticle)
        } else {
            this.articleRepository.update({
                articleId: upsertArticleDto.articleId
            }, upsertArticleDto)
        }
    }

    _getArticleId(articleType:ArticleType):string {
        const articleMap = new Map()
        articleMap.set(ArticleType.TECHNOLOGY, 'te')
        articleMap.set(ArticleType.LIFE, 'lv')
        articleMap.set(ArticleType.DREAM, 'dr')
        articleMap.set(ArticleType.ABOUT, 'ab')
        return articleMap.get(articleType) + Date.now().toString(16)
    }

}
