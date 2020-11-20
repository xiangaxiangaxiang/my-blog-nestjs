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

    private async _getCurrentStatistics(time:Date=new Date()) {
        const date=  stampToStr(time, 'date')
        let statistics:Statistics = await this.statisticsRepository.findOne({
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

    async minusLike(time:Date) {
        const statistics = await this._getCurrentStatistics(time)
        await this.statisticsRepository.decrement({
            id: statistics.id
        }, 'likes', 1)
    }

    async addWebHits() {
        const statistics = await this._getCurrentStatistics()
        await this.statisticsRepository.increment({
            id: statistics.id
        }, 'webHits', 1)
    }

    async addArticleHits() {
        const statistics = await this._getCurrentStatistics()
        await this.statisticsRepository.increment({
            id: statistics.id
        }, 'articleHits', 1)
    }

    async addLikes() {
        const statistics = await this._getCurrentStatistics()
        await this.statisticsRepository.increment({
            id: statistics.id
        }, 'likes', 1)
    }

    async addComments() {
        const statistics = await this._getCurrentStatistics()
        await this.statisticsRepository.increment({
            id: statistics.id
        }, 'comments', 1)
    }

    getMonthlyStatistics() {
        throw new Error('Method not implemented.');
    }
    getTotal() {
        throw new Error('Method not implemented.');
    }

}
