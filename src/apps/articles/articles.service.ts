import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileOperation } from 'src/utils/file-operation';
import { myXss } from 'src/utils/xss';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { ArticleId } from './dto/article-id.dto';
import { UpsertArticleDto } from './dto/article-upsert.dto';
import { GetArticlesAdmin } from './dto/get-articles-admin.dto';
import { Article } from './entity/articles.entity';
import { ArticleType, ReleaseStatus } from './entity/enum';
import { GetArticleList, SaveImage } from './interface/articles.interface';

@Injectable()
export class ArticlesService {
    fileOperation: FileOperation;

    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>
    ) {
        this.fileOperation = new FileOperation()
    }

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

    async showArticleList(getArticlesAdmin:GetArticlesAdmin): Promise<GetArticleList> {
        const filter: FindManyOptions = {
            select: ['articleId', 'title', 'articleType', 'content', 'likeNums', 'clickNums', 'commentsNums', 'firstImage'],
            where: {
                articleType: getArticlesAdmin.articleType,
                releaseStatus: ReleaseStatus.RELEASE
            }
        }
        if (getArticlesAdmin.label) {
            filter.where = Object.assign(filter.where, {
                labels: Like(`%${getArticlesAdmin.label}%`)
            })
        }
        const [ articles, total ] = await this.getAticles(filter, getArticlesAdmin)
        return {
            articles,
            total
        }
    }

    async getArticlesByAdmin(getArticlesAdmin:GetArticlesAdmin): Promise<GetArticleList> {
        const filter: FindManyOptions = {}
        if (getArticlesAdmin.label || getArticlesAdmin.searchText) {
            filter.where = {}
            if (getArticlesAdmin.label) {
                filter.where = Object.assign(filter.where, {
                    labels: Like(`%${getArticlesAdmin.label}%`)
                })
            }
            if (getArticlesAdmin.searchText) {
                filter.where = Object.assign(filter.where, {
                    title: Like(`%${getArticlesAdmin.searchText}%`)
                })
            }
        }
        const [ articles, total ] = await this.getAticles(filter, getArticlesAdmin)
        return {
            articles,
            total
        }
    }

    async getAticles(filter: FindManyOptions, getArticlesAdmin:GetArticlesAdmin) {
        filter = Object.assign({
            skip: getArticlesAdmin.offset,
            take: getArticlesAdmin.limit,
            order: {
                [getArticlesAdmin.sortName]: getArticlesAdmin.orderName
            }
        }, filter)
        return await this.articleRepository.findAndCount(filter)
    }

    saveImage(files):SaveImage {
        const urlList = []
        const saveList = []
        // 保存图片并返回对应的URL
        for (let file in files) {
            const savePath = `/img/article/${Date.now().toString()}_${files[file].name}`
            const item = [parseInt(file), savePath]
            urlList.push(item)
            const pathItem = {
                filePath: files[file].path,
                savePath
            }
            saveList.push(pathItem)
        }
        this.fileOperation.upload(saveList, '/img/article')
        return {urlList}
    }

    async postArticle(articleId:string) {
        const article = await this._getArticle({articleId})
        if (!article) {
            throw new HttpException({message: '文章不存在'}, HttpStatus.BAD_REQUEST)
        }
        article.releaseStatus = ReleaseStatus.RELEASE
        await this.articleRepository.save(article)
    }

    async _getArticle(filter:{articleId:string}):Promise<Article> {
        const article = await this.articleRepository.createQueryBuilder('user').select().where(filter).getOne()
        return article
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
