import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileOperation } from 'src/utils/file-operation';
import { myXss } from 'src/utils/xss';
import { Any, FindManyOptions, Like, Not, Repository } from 'typeorm';
import { UpsertArticleDto } from './dto/article-upsert.dto';
import { GetArticlesAdminDto } from './dto/get-articles-admin.dto';
import { GetLabelsDto } from './dto/get-labels.dto';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { Article } from './entity/articles.entity';
import { ArticleType, ReleaseStatus } from './entity/enum';
import { Labels } from './entity/labels.entity';
import { GetArticleDetail, GetArticleList, GetLabels, SaveImage } from './interface/articles.interface';

@Injectable()
export class ArticlesService {
    fileOperation: FileOperation;

    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @InjectRepository(Labels) private readonly labelRepository: Repository<Labels>
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

    async getLabel(getLabelsDto:GetLabelsDto):Promise<GetLabels> {
        const labels = await this.labelRepository.find({
            select: ['label'],
            where: {
                type: getLabelsDto.type
            }
        })
        return {labels}
    }

    async showArticleList(getArticlesAdminDto:GetArticlesAdminDto): Promise<GetArticleList> {
        const filter: FindManyOptions = {
            select: ['articleId', 'title', 'articleType', 'content', 'likeNums', 'clickNums', 'commentsNums', 'firstImage'],
            where: {
                articleType: getArticlesAdminDto.articleType,
                releaseStatus: ReleaseStatus.RELEASE
            }
        }
        if (getArticlesAdminDto.label) {
            filter.where = Object.assign(filter.where, {
                labels: Like(`%${getArticlesAdminDto.label}%`)
            })
        }
        const [ articles, total ] = await this.getAticles(filter, getArticlesAdminDto)
        return {
            articles,
            total
        }
    }

    async getArticlesByAdmin(getArticlesAdminDto:GetArticlesAdminDto): Promise<GetArticleList> {
        const filter: FindManyOptions = {}
        if (getArticlesAdminDto.label || getArticlesAdminDto.searchText) {
            filter.where = {}
            if (getArticlesAdminDto.label) {
                filter.where = Object.assign(filter.where, {
                    labels: Like(`%${getArticlesAdminDto.label}%`)
                })
            }
            if (getArticlesAdminDto.searchText) {
                filter.where = Object.assign(filter.where, {
                    title: Like(`%${getArticlesAdminDto.searchText}%`)
                })
            }
        }
        const [ articles, total ] = await this.getAticles(filter, getArticlesAdminDto)
        return {
            articles,
            total
        }
    }

    async getAticles(filter: FindManyOptions, getArticlesAdminDto:GetArticlesAdminDto) {
        filter = Object.assign({
            skip: getArticlesAdminDto.offset,
            take: getArticlesAdminDto.limit,
            order: {
                [getArticlesAdminDto.sortName]: getArticlesAdminDto.orderName
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
        article.releaseStatus = ReleaseStatus.RELEASE
        await this.articleRepository.save(article)
    }

    async takeTheArticleOff(articleId:string) {
        const article = await this._getArticle({articleId})
        article.releaseStatus = ReleaseStatus.NOT_RELEASE
        await this.articleRepository.save(article)
    }

    async deleteArticle(articleId:string) {
        const article = await this._getArticle({articleId})
        await this.articleRepository.remove(article)
    }

    async getAbout():Promise<GetArticleDetail> {
        const article = await this.articleRepository.findOne({
            where: {
                articleType: ArticleType.ABOUT,
                releaseStatus: ReleaseStatus.RELEASE
            },
            order: {
                updatedTime: 'DESC'
            },
            select: ['html', 'updatedTime', 'title']
        })
        return {article}
    }

    async getRecommendation(getRecommendationDto:GetRecommendationDto):Promise<GetArticleList> {
        const labels = JSON.parse(getRecommendationDto.labels).map(item => {
            return Like(`%${item}%`)
        })
        let articles = await this.articleRepository.find({
            select: ['articleId', 'title'],
            skip: 0,
            take: 5,
            where: {
                releaseStatus: ReleaseStatus.RELEASE,
                labels: Any(labels),
                articleId: Not(getRecommendationDto.articleId)
            }
        })
        if (articles.length === 0) {
            articles = await this.articleRepository.find({
                select: ['articleId', 'title'],
                skip: 0,
                take: 5,
                where: {
                    releaseStatus: ReleaseStatus.RELEASE,
                    articleId: Not(getRecommendationDto.articleId)
                }
            })
        }
        return {
            articles
        }
    }

    async getArticleDetail(articleId:string):Promise<GetArticleDetail> {
        const article = await this.articleRepository.findOne({
            where: {
                articleId
            },
            select: ['html', 'title', 'markdown', 'labels']
        })
        if (!article) {
            throw new HttpException({message: '文章不存在'}, HttpStatus.BAD_REQUEST)
        }
        return {
            article
        }
    }

    private async _getArticle(filter:{articleId:string}, message='文章不存在'):Promise<Article> {
        const article = await this.articleRepository.createQueryBuilder('user').select().where(filter).getOne()
        if (!article) {
            throw new HttpException({message}, HttpStatus.BAD_REQUEST)
        }
        return article
    }

    private _getArticleId(articleType:ArticleType):string {
        const articleMap = new Map()
        articleMap.set(ArticleType.TECHNOLOGY, 'te')
        articleMap.set(ArticleType.LIFE, 'lv')
        articleMap.set(ArticleType.DREAM, 'dr')
        articleMap.set(ArticleType.ABOUT, 'ab')
        return articleMap.get(articleType) + Date.now().toString(16)
    }

}
