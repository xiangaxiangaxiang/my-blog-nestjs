import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFiles, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { LikesService } from '../likes/likes.service';
import { UserType } from '../users/entity/enum';
import { ArticlesService } from './articles.service';
import { ArticleIdDto } from './dto/article-id.dto';
import { UpsertArticleDto } from './dto/article-upsert.dto';
import { GetArticlesAdminDto } from './dto/get-articles-admin.dto';
import { GetLabelsDto } from './dto/get-labels.dto';
import { GetRecommendationDto } from './dto/get-recommendation.dto';
import { SaveImage } from './interface/articles.interface';

@Controller('articles')
export class ArticlesController {

    constructor(
        private readonly artcilesService:ArticlesService,
        private readonly likesService:LikesService
    ) {}

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('upsert')
    async upsertArticle(@Body() upsertArticleDto: UpsertArticleDto) {

        const labels = JSON.parse(upsertArticleDto.labels as string)
        if (!Array.isArray(labels)) {
            throw new HttpException({message: '参数有误'}, HttpStatus.BAD_REQUEST)
        }
        upsertArticleDto.labels = labels.join(',')

        await this.artcilesService.upsertArticle(upsertArticleDto)
        const message = upsertArticleDto.articleId ? '修改文章成功' : '添加文章成功'
        throw new HttpException({message}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Get('list')
    async getArticleListByAdmin(@Query() getArticlesAdminDto:GetArticlesAdminDto) {
        const data = await this.artcilesService.getArticlesByAdmin(getArticlesAdminDto)
        throw new HttpException({ data }, HttpStatus.OK)
    }

    @Get('/')
    async getArticleList(@Query() getArticlesAdminDto:GetArticlesAdminDto) {
        const data = await this.artcilesService.showArticleList(getArticlesAdminDto)
        const res = {
            data
        }
        throw new HttpException(res, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('image_upload')
    @UseInterceptors(FilesInterceptor('files'))
    saveImage(@UploadedFiles() files): SaveImage {
        const data = this.artcilesService.saveImage(files)
        throw new HttpException({data}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('post_ariticle')
    async postArticle(@Body() {articleId}:ArticleIdDto) {
        await this.artcilesService.postArticle(articleId)
        throw new HttpException({message: '文章发表成功'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('take_off')
    async takeTheArticleOff(@Body() {articleId}:ArticleIdDto) {
        await this.artcilesService.takeTheArticleOff(articleId)
        throw new HttpException({message: '文章已下架'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('delete')
    async deleteArticle(@Body() {articleId}:ArticleIdDto) {
        await this.artcilesService.deleteArticle(articleId)
        throw new HttpException({message: '文章已删除'}, HttpStatus.OK)
    }

    @Get('about')
    async getAbout() {
        const data = await this.artcilesService.getAbout()
        throw new HttpException({data}, HttpStatus.OK)
    }

    @Get('labels')
    async getLabel(@Query() getLabelsDto:GetLabelsDto) {
        const data = await this.artcilesService.getLabel(getLabelsDto)
        throw new HttpException({data}, HttpStatus.OK)
    }

    @Get('recommendation')
    async getRecommendation(@Query() getRecommendationDto:GetRecommendationDto) {
        const data = await this.artcilesService.getRecommendation(getRecommendationDto)
        throw new HttpException({data}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.TOURIST))
    @Get('detail')
    async getArticleDetail(@Query() {articleId}:ArticleIdDto, @Request() req) {
        const {article} = await this.artcilesService.getArticleDetail(articleId)
        const likeStatus = await this.likesService.getLikeStatus(articleId, req.user.uid)
        const data = {
            article,
            likeStatus
        }
        throw new HttpException({data}, HttpStatus.OK)
    }

}
