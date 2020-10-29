import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { ArticlesService } from './articles.service';
import { ArticleId } from './dto/article-id.dto';
import { UpsertArticleDto } from './dto/article-upsert.dto';
import { GetArticlesAdmin } from './dto/get-articles-admin.dto';
import { SaveImage } from './interface/articles.interface';

@Controller('articles')
export class ArticlesController {

    constructor(
        private readonly artcilesService:ArticlesService
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
    async getArticleListByAdmin(@Query() getArticlesAdmin:GetArticlesAdmin) {
        const data = await this.artcilesService.getArticlesByAdmin(getArticlesAdmin)
        const res = {
            data
        }
        throw new HttpException(res, HttpStatus.OK)
    }

    @Get('/')
    async getArticleList(@Query() getArticlesAdmin:GetArticlesAdmin) {
        const data = await this.artcilesService.showArticleList(getArticlesAdmin)
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
    async postArticle(@Body() {articleId}:ArticleId) {
        await this.artcilesService.postArticle(articleId)
        throw new HttpException({message: '文章发表成功'}, HttpStatus.OK)
    }


}
