import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Statistics } from 'src/apps/statistics/entity/statistics.entity';
import { stampToStr } from 'src/utils/util';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Statistics) private readonly statisticsRepository: Repository<Statistics>,
    ) {}

    @Cron('0 0 0 * * *')
    async createStatistics() {
        const newStatistics = this.statisticsRepository.create({
            date: stampToStr(Date.now(), 'date')
        })
        await this.statisticsRepository.save(newStatistics)
        console.log(666)
    }

}