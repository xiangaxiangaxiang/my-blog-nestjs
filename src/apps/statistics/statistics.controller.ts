import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { UserType } from '../users/entity/enum';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {

    constructor(
        private readonly statisticsService:StatisticsService
    ) {}

    @Get('get_total')
    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    async getTotal() {
        const data = await this.statisticsService.getTotal()
        throw new HttpException({data}, HttpStatus.OK)
    }

    @Get('get_monthly_statistics')
    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    async getMonthlyStatistics() {
        const data = await this.statisticsService.getMonthlyStatistics()
        throw new HttpException({data}, HttpStatus.OK)
    }

}
