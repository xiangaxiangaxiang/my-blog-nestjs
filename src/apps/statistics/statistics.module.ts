import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Statistics } from './entity/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [TypeOrmModule.forFeature([Statistics])],
    exports: [StatisticsService],
    controllers: [StatisticsController],
    providers: [StatisticsService, JwtStrategy]
})
export class StatisticsModule {}
