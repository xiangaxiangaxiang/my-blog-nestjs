import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './apps/users/users.module';
import { ArticlesModule } from './apps/articles/articles.module';
import { StatisticsModule } from './apps/statistics/statistics.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, ArticlesModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
