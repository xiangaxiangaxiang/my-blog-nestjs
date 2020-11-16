import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stampToStr } from 'src/utils/util';
import { Repository } from 'typeorm';
import { Statistics } from './entity/statistics.entity';

@Injectable()
export class StatisticsService {

    constructor(
        @InjectRepository(Statistics) private readonly statisticsRepository: Repository<Statistics>,
    ) {}

    private async _getCurrentStatistics() {
        const date=  stampToStr(Date.now(), 'date')
        let statistics:Statistics | Statistics[] = await this.statisticsRepository.find({
            where: {
                date
            }
        })
        if (!statistics) {
            statistics = await this._addCurrentStatistics()
        }
        return statistics
    }

    private async _addCurrentStatistics() {
        const newStatistics = this.statisticsRepository.create({
            date: stampToStr(Date.now(), 'date')
        })
        await this.statisticsRepository.save(newStatistics)
        return newStatistics
    }

}
