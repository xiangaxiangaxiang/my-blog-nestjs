import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/type';
import { ArticlesService } from './articles.service';
import { UpsertArticleDto } from './dto/article-upsert.dto';

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

}
